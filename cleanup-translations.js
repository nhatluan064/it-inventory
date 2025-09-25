// Script to remove unused translation keys
const fs = require('fs');

// List of unused translation keys from the analysis
const unusedKeys = [
  'loading_data', 'dashboard', 'dashboard_desc', 'sort_az', 'sort_za', 'sort_asc', 'sort_desc', 
  'sort_newest', 'sort_oldest', 'register_title', 'register_success_and_login', 'login_success_title',
  'login_success_message', 'register_success_message', 'login_continue_button', 'register_back_to_login',
  'dept_production_management', 'toast_sn_already_exists_in_inventory', 'toast_sn_is_required', 
  'toast_logout_local', 'toast_model_name_updated_successfully', 'prompt_enter_repair_note',
  'default_repair_note', 'serial_number_required', 'toast_sn_updated_required', 'select_sn_to_allocate',
  'allocated_sn', 'please_select_item_to_purchase', 'please_select_purchased_items', 'allocation_quantity_error',
  'please_enter_device_name', 'revert_to_pending', 'admin', 'serial_number_sn_mobile', 'all_categories',
  'add_new', 'max', 'notifications', 'no_new_notifications', 'view_all', 'profile', 'quick_actions',
  'add_view_master_list', 'manage_purchasing', 'manage_inventory', 'view_full_report', 'in_stock',
  'device_name_mobile', 'user_in_use_mobile', 'proceed_to_purchase_count', 'imported', 'filter_by_category',
  'employee_info', 'no_liquidation_items', 'recall_dedicated_title', 'recall_dedicated_desc',
  'device_user_column', 'no_allocated_items_for_recall', 'confirm_delete', 'are_you_sure_delete',
  'edit_device_name', 'account_information', 'password_change_disabled', 'condition_good_as_new',
  'condition_used', 'condition_damaged_needs_maintenance', 'employee_id_mobile', 'good_condition',
  'recall_quantity', 'failure_note_placeholder', 'order_number'
];

const translationsPath = './src/components/Translations.js';

// Read the original file
let content = fs.readFileSync(translationsPath, 'utf8');

// Create backup
fs.writeFileSync(translationsPath + '.backup', content);

console.log(`Created backup: ${translationsPath}.backup`);
console.log(`Removing ${unusedKeys.length} unused translation keys...`);

// Function to remove a key from both vi and en sections
function removeTranslationKey(content, key) {
  // Pattern to match the key and its value (handles multiline values)
  const patterns = [
    // Single line pattern: key: "value",
    new RegExp(`^\\s*${key}\\s*:\\s*"[^"]*"\\s*,?\\s*$`, 'gm'),
    // Multi line pattern: key: "value\nmore text",
    new RegExp(`^\\s*${key}\\s*:\\s*"[^"]*(?:\\\\.|[^"\\\\])*"\\s*,?\\s*$`, 'gm'),
    // Alternative quote styles
    new RegExp(`^\\s*${key}\\s*:\\s*'[^']*'\\s*,?\\s*$`, 'gm'),
    new RegExp(`^\\s*${key}\\s*:\\s*\`[^\`]*\`\\s*,?\\s*$`, 'gm')
  ];

  let newContent = content;
  for (const pattern of patterns) {
    newContent = newContent.replace(pattern, '');
  }
  
  return newContent;
}

// Remove each unused key
let cleanedContent = content;
let removedCount = 0;

for (const key of unusedKeys) {
  const beforeLength = cleanedContent.length;
  cleanedContent = removeTranslationKey(cleanedContent, key);
  
  if (cleanedContent.length < beforeLength) {
    removedCount++;
    console.log(`✓ Removed: ${key}`);
  } else {
    console.log(`✗ Could not remove: ${key}`);
  }
}

// Clean up extra empty lines and ensure proper formatting
cleanedContent = cleanedContent
  .replace(/\n\s*\n\s*\n/g, '\n\n')  // Remove extra empty lines
  .replace(/,\s*\n\s*}/g, '\n  }')    // Clean up trailing commas before closing braces
  .replace(/,\s*\n\s*,/g, ',\n')      // Remove duplicate commas

// Write the cleaned file
fs.writeFileSync(translationsPath, cleanedContent);

console.log(`\n=== CLEANUP COMPLETE ===`);
console.log(`Successfully removed: ${removedCount}/${unusedKeys.length} keys`);
console.log(`Original file size: ${content.length} characters`);
console.log(`New file size: ${cleanedContent.length} characters`);
console.log(`Saved: ${content.length - cleanedContent.length} characters (${((content.length - cleanedContent.length) / content.length * 100).toFixed(1)}%)`);
console.log(`\nBackup saved as: ${translationsPath}.backup`);
console.log('You can restore the backup if needed: copy Translations.js.backup to Translations.js');