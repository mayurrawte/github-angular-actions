import { nxpath, primaryKey } from './constant';
import { saveCache } from "@actions/cache";

// core.info(`${packageManager} cache is not found`);

saveCache([nxpath], primaryKey).then((data) => {
    console.log(data);
})