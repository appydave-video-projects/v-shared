#!/usr/bin/env ruby
# frozen_string_literal: true

# Verify and cleanup duplicate SSD folders caused by naming bug
#
# This script:
# 1. Verifies that wrong-format folders (b00-49, b50-99) are complete duplicates
# 2. Optionally deletes them to free up ~33GB of space
#
# Usage:
#   ruby verify_and_cleanup_duplicates.rb          # Verify only
#   ruby verify_and_cleanup_duplicates.rb --delete # Verify and delete

require 'fileutils'
require 'digest'

SSD_BASE = '/Volumes/T7/youtube-PUBLISHED/appydave'

DUPLICATE_PAIRS = [
  { wrong: 'b00-49', correct: 'b00-b49' },
  { wrong: 'b50-99', correct: 'b50-b99' }
]

def delete_mode?
  ARGV.include?('--delete')
end

def format_bytes(bytes)
  if bytes < 1024
    "#{bytes}B"
  elsif bytes < 1024 * 1024
    "#{(bytes / 1024.0).round(1)}KB"
  elsif bytes < 1024 * 1024 * 1024
    "#{(bytes / 1024.0 / 1024.0).round(1)}MB"
  else
    "#{(bytes / 1024.0 / 1024.0 / 1024.0).round(1)}GB"
  end
end

def get_dir_size(dir)
  return 0 unless Dir.exist?(dir)

  total = 0
  Dir.glob(File.join(dir, '**', '*'), File::FNM_DOTMATCH).each do |file|
    total += File.size(file) if File.file?(file) && file !~ /\.DS_Store$/
  end
  total
end

def verify_projects_are_duplicates(wrong_folder, correct_folder)
  puts "\n🔍 Verifying: #{File.basename(wrong_folder)} vs #{File.basename(correct_folder)}"
  puts "=" * 70

  # Get projects in each folder
  wrong_projects = Dir.glob(File.join(wrong_folder, '*/')).map { |p| File.basename(p) }.sort
  correct_projects = Dir.glob(File.join(correct_folder, '*/')).map { |p| File.basename(p) }.sort

  puts "Projects in #{File.basename(wrong_folder)}: #{wrong_projects.size}"
  puts "Projects in #{File.basename(correct_folder)}: #{correct_projects.size}"

  # Check if all wrong projects exist in correct folder
  missing = wrong_projects - correct_projects

  if missing.any?
    puts "\n❌ VERIFICATION FAILED!"
    puts "   These projects are in #{File.basename(wrong_folder)} but NOT in #{File.basename(correct_folder)}:"
    missing.each { |p| puts "   - #{p}" }
    return false
  end

  puts "\n✅ All projects in #{File.basename(wrong_folder)} exist in #{File.basename(correct_folder)}"

  # Verify each project folder is identical (except .DS_Store)
  puts "\n🔬 Detailed verification (comparing file sizes)..."

  all_match = true
  wrong_projects.each do |project|
    wrong_path = File.join(wrong_folder, project)
    correct_path = File.join(correct_folder, project)

    wrong_size = get_dir_size(wrong_path)
    correct_size = get_dir_size(correct_path)

    if (wrong_size - correct_size).abs > 1024 # Allow 1KB difference for .DS_Store
      puts "   ⚠️  #{project}: Size mismatch! #{format_bytes(wrong_size)} vs #{format_bytes(correct_size)}"
      all_match = false
    else
      puts "   ✓ #{project}: #{format_bytes(wrong_size)}"
    end
  end

  if all_match
    puts "\n✅ All project folders match (excluding .DS_Store)"
    return true
  else
    puts "\n❌ Some project folders don't match"
    return false
  end
end

# Check SSD is mounted
unless Dir.exist?(SSD_BASE)
  puts "❌ SSD not mounted at #{SSD_BASE}"
  exit 1
end

puts delete_mode? ? "🗑️  VERIFY AND DELETE MODE" : "🔍 VERIFICATION MODE (read-only)"
puts "=" * 70
puts

total_to_delete = 0
verification_results = []

# Verify each duplicate pair
DUPLICATE_PAIRS.each do |pair|
  wrong_path = File.join(SSD_BASE, pair[:wrong])
  correct_path = File.join(SSD_BASE, pair[:correct])

  unless Dir.exist?(wrong_path)
    puts "ℹ️  #{pair[:wrong]} doesn't exist (already cleaned up?)"
    verification_results << { pair: pair, verified: true, exists: false }
    next
  end

  unless Dir.exist?(correct_path)
    puts "❌ ERROR: #{pair[:correct]} doesn't exist but #{pair[:wrong]} does!"
    verification_results << { pair: pair, verified: false, exists: true }
    next
  end

  verified = verify_projects_are_duplicates(wrong_path, correct_path)

  if verified
    size = get_dir_size(wrong_path)
    total_to_delete += size
    verification_results << { pair: pair, verified: true, exists: true, size: size }
  else
    verification_results << { pair: pair, verified: false, exists: true }
  end
end

# Summary
puts "\n" + "=" * 70
puts "📊 VERIFICATION SUMMARY"
puts "=" * 70

all_verified = verification_results.all? { |r| r[:verified] }

verification_results.each do |result|
  status = if !result[:exists]
             "✓ Already cleaned"
           elsif result[:verified]
             "✅ Verified duplicate"
           else
             "❌ FAILED verification"
           end

  size_info = result[:size] ? " (#{format_bytes(result[:size])})" : ""
  puts "#{status}: #{result[:pair][:wrong]}#{size_info}"
end

puts
puts "Total duplicate data: #{format_bytes(total_to_delete)}"

# Delete if requested and all verified
if delete_mode?
  puts

  if all_verified && total_to_delete > 0
    puts "⚠️  ABOUT TO DELETE #{format_bytes(total_to_delete)} of duplicate data!"
    puts
    puts "Folders to delete:"
    verification_results.select { |r| r[:exists] && r[:verified] }.each do |result|
      puts "  - #{result[:pair][:wrong]} (#{format_bytes(result[:size])})"
    end
    puts
    puts "Press ENTER to continue, or Ctrl+C to cancel..."
    $stdin.gets

    # Delete verified duplicates
    verification_results.select { |r| r[:exists] && r[:verified] }.each do |result|
      wrong_path = File.join(SSD_BASE, result[:pair][:wrong])
      puts "\n🗑️  Deleting: #{result[:pair][:wrong]}"
      FileUtils.rm_rf(wrong_path)
      puts "   ✅ Deleted"
    end

    puts "\n✅ Cleanup complete! Freed #{format_bytes(total_to_delete)}"
    puts
    puts "Next steps:"
    puts "  1. ruby generate_manifest.rb    # Update manifest"
    puts "  2. Check dashboard to confirm"
  elsif !all_verified
    puts "❌ Cannot delete - verification failed for some folders"
    puts "   Please review the output above"
    exit 1
  else
    puts "ℹ️  Nothing to delete (already cleaned up)"
  end
else
  puts
  if all_verified && total_to_delete > 0
    puts "✅ All verifications passed!"
    puts
    puts "To delete these duplicate folders and free #{format_bytes(total_to_delete)}:"
    puts "  ruby verify_and_cleanup_duplicates.rb --delete"
  elsif !all_verified
    puts "❌ Verification failed - DO NOT delete!"
    exit 1
  else
    puts "ℹ️  No duplicate folders found"
  end
end
