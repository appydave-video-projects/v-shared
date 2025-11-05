# Brand Configuration System

**Created**: 2025-11-03
**Purpose**: Replace hardcoded brand detection with flexible configuration
**Status**: Design document

---

## Problem with Current Approach

### Hardcoded Brand Detection (Bad)
```ruby
def detect_brand
  current_path = Dir.pwd

  if current_path.include?('/v-appydave')
    'v-appydave'
  elsif current_path.include?('/v-voz')
    'v-voz'
  elsif current_path.include?('/v-aitldr')
    'v-aitldr'
  # ... adding new brand requires code change
  end
end
```

**Issues**:
- ❌ Adding new brand requires code modification
- ❌ No central registry of brands
- ❌ Can't customize per-brand settings
- ❌ Hard to test different brand configurations

---

## Proposed Solution: Configuration File

### `.brands.json` (in v-shared/video-asset-tools/)

```json
{
  "version": "1.0.0",
  "brands": [
    {
      "id": "appydave",
      "name": "AppyDave",
      "folderPrefix": "v-appydave",
      "workflowType": "flivideo",
      "s3Prefix": "staging/v-appydave/",
      "active": true,
      "collaborators": ["david", "jan"],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z]\\d{2,3}-.+"
      }
    },
    {
      "id": "voz",
      "name": "VOZ",
      "folderPrefix": "v-voz",
      "workflowType": "storyline",
      "s3Prefix": "staging/v-voz/",
      "active": true,
      "collaborators": ["david", "jan"],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z\\-]+"
      }
    },
    {
      "id": "aitldr",
      "name": "AITLDR",
      "folderPrefix": "v-aitldr",
      "workflowType": "storyline",
      "s3Prefix": "staging/v-aitldr/",
      "active": true,
      "collaborators": ["david", "jan"],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z\\-]+"
      }
    },
    {
      "id": "kiros",
      "name": "Kiros",
      "folderPrefix": "v-kiros",
      "workflowType": "tbd",
      "s3Prefix": "staging/v-kiros/",
      "active": false,
      "collaborators": [],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z\\-]+"
      }
    },
    {
      "id": "beauty-and-joy",
      "name": "Beauty & Joy",
      "folderPrefix": "v-beauty-and-joy",
      "workflowType": "tbd",
      "s3Prefix": "staging/v-beauty-and-joy/",
      "active": false,
      "collaborators": [],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z\\-]+"
      }
    },
    {
      "id": "supportsignal",
      "name": "SupportSignal",
      "folderPrefix": "v-supportsignal",
      "workflowType": "tbd",
      "s3Prefix": "staging/v-supportsignal/",
      "active": false,
      "collaborators": [],
      "settings": {
        "stagingCleanupDays": 90,
        "glacierTransitionDays": 365,
        "projectNamingPattern": "^[a-z\\-]+"
      }
    }
  ]
}
```

---

## Configuration Loader (Ruby)

### `lib/brand_config.rb`

```ruby
require 'json'

class BrandConfig
  CONFIG_FILE = File.join(File.dirname(__FILE__), '..', '.brands.json')

  def self.load
    unless File.exist?(CONFIG_FILE)
      raise "Brand configuration not found: #{CONFIG_FILE}"
    end

    config_data = File.read(CONFIG_FILE)
    JSON.parse(config_data)
  end

  def self.all_brands
    load['brands']
  end

  def self.active_brands
    all_brands.select { |b| b['active'] }
  end

  def self.find_brand_by_path(path)
    all_brands.find do |brand|
      path.include?(brand['folderPrefix'])
    end
  end

  def self.find_brand_by_id(id)
    all_brands.find { |brand| brand['id'] == id }
  end

  def self.detect_current_brand
    current_path = Dir.pwd
    brand = find_brand_by_path(current_path)

    unless brand
      raise "Could not detect brand from path: #{current_path}.\nKnown brands: #{all_brands.map { |b| b['folderPrefix'] }.join(', ')}"
    end

    brand
  end

  def self.get_s3_prefix(brand_id, project_id)
    brand = find_brand_by_id(brand_id)
    "#{brand['s3Prefix']}#{project_id}/"
  end
end
```

---

## Usage in Tools

### Before (Hardcoded)
```ruby
def detect_brand
  current_path = Dir.pwd
  if current_path.include?('/v-appydave')
    'v-appydave'
  elsif current_path.include?('/v-voz')
    'v-voz'
  # ...
  end
end
```

### After (Configuration-Based)
```ruby
require_relative '../lib/brand_config'

# Auto-detect brand
brand = BrandConfig.detect_current_brand
puts "Working with brand: #{brand['name']}"
puts "S3 prefix: #{brand['s3Prefix']}"

# Get S3 path for project
s3_key = BrandConfig.get_s3_prefix('appydave', 'b65-guy-monroe')
# => "staging/v-appydave/b65-guy-monroe/"

# List only active brands
BrandConfig.active_brands.each do |brand|
  puts "Active brand: #{brand['name']}"
end
```

---

## Brand-Level Configuration Capabilities

### 1. Basic Identity
- `id`: Short identifier (appydave, voz, aitldr)
- `name`: Display name (AppyDave, VOZ, AITLDR)
- `folderPrefix`: Local folder name (v-appydave, v-voz)

### 2. S3 Configuration
- `s3Prefix`: S3 path prefix (staging/v-appydave/)
- `stagingCleanupDays`: Auto-delete staging files after N days (90)
- `glacierTransitionDays`: Move to Glacier after N days (365)

### 3. Workflow Configuration
- `workflowType`: flivideo, storyline, or tbd
- `projectNamingPattern`: Regex for valid project IDs
- `active`: Enable/disable brand without removing config

### 4. Collaboration
- `collaborators`: List of users (david, jan)
- Future: Per-brand IAM policies

### 5. Future Expansion
```json
{
  "settings": {
    "stagingCleanupDays": 90,
    "glacierTransitionDays": 365,
    "projectNamingPattern": "^[a-z]\\d{2,3}-.+",

    // Future capabilities:
    "autoArchiveThreshold": "30days",
    "notifyOnUpload": ["david@example.com"],
    "costCenter": "appydave-brand",
    "defaultFilePermissions": "private",
    "allowedFileTypes": [".mp4", ".mov", ".avi"],
    "maxFileSizeGB": 10,
    "compressionEnabled": false
  }
}
```

---

## Adding a New Brand (Easy)

### Old Way (Code Change Required)
1. Edit `s3_sync_up.rb`
2. Add new `elsif` branch
3. Commit code change
4. Deploy to all users

### New Way (Configuration Only)
1. Edit `.brands.json`
2. Add new brand entry:
```json
{
  "id": "newbrand",
  "name": "New Brand",
  "folderPrefix": "v-newbrand",
  "workflowType": "flivideo",
  "s3Prefix": "staging/v-newbrand/",
  "active": true,
  "collaborators": ["david"],
  "settings": {
    "stagingCleanupDays": 90,
    "glacierTransitionDays": 365,
    "projectNamingPattern": "^[a-z]\\d{2,3}-.+"
  }
}
```
3. Done! Tools automatically recognize it

---

## Benefits

### For Development
- ✅ Add new brands without code changes
- ✅ Test different configurations easily
- ✅ Centralized brand registry
- ✅ Type-safe brand access

### For Operations
- ✅ Change cleanup policies per brand
- ✅ Enable/disable brands without deleting config
- ✅ Track collaborators per brand
- ✅ Customize S3 paths per brand

### For Future Features
- ✅ Per-brand cost tracking
- ✅ Per-brand notification settings
- ✅ Per-brand file size limits
- ✅ Per-brand compression rules

---

## Migration Plan

### Step 1: Create Configuration File
- [ ] Create `.brands.json` with all 6 brands
- [ ] Validate JSON structure
- [ ] Test loading in Ruby

### Step 2: Create Brand Config Library
- [ ] Implement `lib/brand_config.rb`
- [ ] Add unit tests
- [ ] Document API

### Step 3: Update Tools
- [ ] Update `s3_sync_up.rb` to use BrandConfig
- [ ] Update `s3_sync_down.rb` to use BrandConfig
- [ ] Update `s3_sync_status.rb` to use BrandConfig
- [ ] Update `s3_sync_cleanup.rb` to use BrandConfig

### Step 4: Update Documentation
- [ ] Update README.md with configuration examples
- [ ] Update CLAUDE.md with brand addition instructions
- [ ] Create brand-configuration.md (this file)

---

## Testing Checklist

### Brand Detection
- [ ] Test auto-detection from v-appydave/
- [ ] Test auto-detection from v-voz/
- [ ] Test auto-detection from v-aitldr/
- [ ] Test error when in non-brand directory

### Configuration Loading
- [ ] Test loading all brands
- [ ] Test filtering active brands
- [ ] Test finding brand by ID
- [ ] Test finding brand by path

### S3 Path Generation
- [ ] Test S3 prefix for appydave project
- [ ] Test S3 prefix for voz project
- [ ] Test S3 prefix for aitldr project

---

## Example: Per-Brand Settings

### AppyDave (High Volume, Short Retention)
```json
{
  "id": "appydave",
  "settings": {
    "stagingCleanupDays": 60,       // Faster cleanup (high volume)
    "glacierTransitionDays": 365,    // 1 year to Glacier
    "autoArchiveThreshold": "14days" // Auto-archive after 2 weeks
  }
}
```

### VOZ (Client Work, Longer Retention)
```json
{
  "id": "voz",
  "settings": {
    "stagingCleanupDays": 180,      // Keep longer (client work)
    "glacierTransitionDays": 730,    // 2 years to Glacier (client requirement)
    "autoArchiveThreshold": "30days" // Keep active longer
  }
}
```

---

## Related Documentation

- `vam-s3-staging-design.md` - Main PRD
- `vam-s3-aws-architecture.md` - AWS architecture
- `../README.md` - Tool usage

---

**Status**: Design complete, ready for implementation
**Next**: Implement `.brands.json` and `lib/brand_config.rb`
