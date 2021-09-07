import { logger } from './logger.js';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import FileHelper from './fileHelper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const defaultDownloadsFodler = resolve(__dirname, '../', 'downloads');

export default class Routes {
  io
  constructor(downloadsFolder = defaultDownloadsFodler) {
    this.downloadsFolder = downloadsFolder;
    this.fileHelper = FileHelper;
  }

  setSocketInstance(io) {
    this.io = io;
  }

  async defaultRoutes(request, response) {
    response.end('Hello World');
  }

  async options(request, response) {
    response.writeHead(204);
    response.end();
  }

  async post(request, response) {
    logger.info('ae');
    response.end('Hello World');
  }

  async get(request, response) {
    const files = await this.fileHelper.getFilesStatus(this.downloadsFolder);
    response.writeHead(200)
    response.end(JSON.stringify(files));
  }

  async handler(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    
    // passa as funções dessa class para chosen. Se no request.method vier 'GET, ele passa a função get dessa class (fica this.get())
    const chosen = this[request.method.toLowerCase()] || this.defaultRoutes;

    // usar apply da no mesdo de chosen(), mas usamos ele aqui para passar o "this" para ele (que é essa class) e a segunda é o array de args da class
    return chosen.apply(this, [request, response]);
  }

}