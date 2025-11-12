import * as migration_20251111_174626_add_new_collections from './20251111_174626_add_new_collections';
import * as migration_20251111_205751_add_printify_indexes from './20251111_205751_add_printify_indexes';
import * as migration_20251111_214800_add_locked_documents from './20251111_214800_add_locked_documents';
import * as migration_20251112_remove_old_collections from './20251112_remove_old_collections';

export const migrations = [
  {
    up: migration_20251111_174626_add_new_collections.up,
    down: migration_20251111_174626_add_new_collections.down,
    name: '20251111_174626_add_new_collections'
  },
  {
    up: migration_20251111_205751_add_printify_indexes.up,
    down: migration_20251111_205751_add_printify_indexes.down,
    name: '20251111_205751_add_printify_indexes'
  },
  {
    up: migration_20251111_214800_add_locked_documents.up,
    down: migration_20251111_214800_add_locked_documents.down,
    name: '20251111_214800_add_locked_documents'
  },
  {
    up: migration_20251112_remove_old_collections.up,
    down: migration_20251112_remove_old_collections.down,
    name: '20251112_remove_old_collections'
  },
];
