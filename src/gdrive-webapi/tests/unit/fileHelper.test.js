import {
  jest,
  describe,
  test,
  expect
} from '@jest/globals';

import fs from 'fs';
import FileHelper  from '../../src/fileHelper.js';

import Routes from '../../src/routes.js';

describe('#FileHelper test suite', () => {
  describe('#getFileStatus', () => {
    test('It should return filles statuses in correct format', async () => {
      // size tá em bytes

      const statMock = {
        dev: 1988634819,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 1688849862316467,
        size: 207790,
        blocks: 408,
        atimeMs: 1630985124525.0784,
        mtimeMs: 1628118300701.663,
        ctimeMs: 1630985100035.573,
        birthtimeMs: 1628118277075.2722,
        atime: '2021-09-07T03:25:24.525Z',
        mtime: '2021-08-04T23:05:00.702Z',
        ctime: '2021-09-07T03:25:00.036Z',
        birthtime: '2021-08-04T23:04:37.075Z'
      }

      const mockUser = 'ADEMIR';
      process.env.USER = mockUser;
      const filename = 'file.png';

      jest.spyOn(fs.promises, fs.promises.readdir.name).mockResolvedValue([filename]);

      jest.spyOn(fs.promises, fs.promises.stat.name).mockResolvedValue(statMock);

      const result = await FileHelper.getFilesStatus('/tmp');

      const expected = [
        {
          size: '208 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ];

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`);

      expect(result).toMatchObject(expected);
    });
  });
});
