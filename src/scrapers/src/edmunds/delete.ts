import { deleteDirectoryFromStorage } from '../common/firebase';

(async () => {
  await deleteDirectoryFromStorage('edmunds');
})();