import {
  jest,
  describe,
  test,
  expect
} from '@jest/globals';

import fs from 'fs';
import { resolve } from 'path';

import UploadHandler from '../../src/uploadHandler.js';
import TestUtil from '../_util/testUtil.js';

describe('#Upload Handler test suit', () => {

  const ioObj = {
    to: (id) => ioObj,
    emit: (event, message) => {},
  };

  describe('#registerEvents', () => {
    test('should call onFile and onFinish functions on Busboy instance', () => {
      const uploadHandler = new UploadHandler({
        io: ioObj,
        socketId: '01'
      });

      jest.spyOn(uploadHandler, uploadHandler.onFile.name).mockResolvedValue();

      const headers = {
        'content-type': 'multipart/form-data; boundary='
      };

      const onFinish = jest.fn();

      const busboyInstance = uploadHandler.registerEvents(headers, onFinish);
      
      const fileStream = TestUtil.generateReadableStream([ 'chunk', 'of', 'data' ]);

      busboyInstance.emit('file', 'fieldNme', fileStream, 'filename.txt')

      // Pega o primeiro elemento qiue está ouvindo finish e manda executar
      busboyInstance.listeners('finish')[0].call();

      expect(uploadHandler.onFile).toHaveBeenCalled()
      expect(onFinish).toHaveBeenCalled()
    });
  });

  describe('#onFile', () => {
    test('given a stream file it should save it on disk', async () => {
      const chunks = ['hey', 'dude'];
      const downloadsFolder = '/tmp';
      const handler = new UploadHandler({
        io: ioObj,
        socketId: '01',
        downloadsFolder
      });

      const onData = jest.fn();

      jest.spyOn(fs, fs.createWriteStream.name).mockImplementation(() => TestUtil.generateWritableStream(onData))

      const onTransform = jest.fn();
      jest.spyOn(handler, handler.handleFileBytes.name).mockImplementation(() => TestUtil.generateTransformStream(onTransform));

      const params = {
        fieldName: 'video',
        file: TestUtil.generateReadableStream(chunks),
        fileName: 'mockFile.mov'
      };

      await handler.onFile(...Object.values(params));

      expect(onData.mock.calls.join()).toEqual(chunks.join());
      expect(onTransform.mock.calls.join()).toEqual(chunks.join());

      const expectedFileName = resolve(handler.downloadsFolder, params.fileName);

      // expect(fs.createWriteStream).toHaveBeenCalledWith(expectedFileName);

    });
  });
});