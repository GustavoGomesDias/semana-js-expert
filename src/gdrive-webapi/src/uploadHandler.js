import Busboy from 'busboy';
import { pipeline } from 'stream/promises';
import fs from 'fs';

import { logger } from './logger.js'

export default class UploadHandler {
  constructor({ io, socketId, downloadsFolder }) {
    this.io = io;
    this.socketId = socketId;
    this.downloadsFolder = downloadsFolder;
  }

  handleFileBytes() {

  }

  async onFile(fieldName, file, fileName) {
    const saveTo = `${this.downloadsFolder}/${fileName}`;
    await pipeline(
      file,
      // mesma coisa de this.handleFileBytes(filename)
      this.handleFileBytes.apply(this, [ fileName ]),
      fs.createWriteStream(saveTo)
    );

    logger.info(`File [${fileName}] finished`)
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });

    // bind => garante q o this seja da class e não do on('file');
    busboy.on('file', this.onFile.bind(this));
    busboy.on('finish', onFinish);

    return busboy;
  }
}
