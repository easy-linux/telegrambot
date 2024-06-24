import sqlite3 from 'sqlite3'
import config from '../../config.js'


const db = new sqlite3.Database(config.databasePath);

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS videos (
        video_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        video_name TEXT NOT NULL UNIQUE,
        video_desc TEXT NOT NULL DEFAULT '',
        file_id TEXT NOT NULL DEFAULT ''
    );`);
})

export const insertVideo = (videoName, videoDesc, fileId) => {
    return new Promise((resolve, reject) => {
        db.parallelize(() => {
            db.run(`INSERT INTO videos(
                video_name, video_desc, file_id
            ) VALUES(?, ?, ?)`, [ videoName, videoDesc ? videoDesc : '', fileId], 
            function (err) {
                if (err) {
                    reject(err)
                    console.log('Ошибка при добавлении видео', err)
                    return
                }
                console.log('Видео добавлено успешно', this.lastID)
                resolve({ lastID: this.lastID })
            });
        })
    })
}

export const getVideo = (videoId) => {
    return new Promise((resolve, reject) => {
        db.parallelize(() => {
            db.all(`SELECT * FROM videos WHERE video_id = ?`, [videoId], function (err, rows) {
                if (err) {
                    reject(err)
                    console.log('Ошибка при извлечении видео', err)
                    return
                }
                resolve(rows)
            });
        })
    })
}


export const findByName = (videoName) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM videos WHERE video_name LIKE '%${videoName}%'`, [], (err, rows) => {
            if (err) {
                console.log('findByName: ошибка при поиске видео', err)
                reject(err)
                return
            }
            resolve(rows)
        });
    })
}

export const getByName = (videoName) => {
    return new Promise((resolve, reject) => {
        console.log('getByName: ', videoName)
        db.all(`SELECT * FROM videos WHERE video_name = ?`, [videoName], (err, rows) => {
            if (err) {
                console.log('getByName: ошибка', err)
                reject(err)
                return
            }
            console.log('getByName: ok', JSON.stringify(rows, null, 4))
            resolve(rows)
        });
    })
}

export const deleteVideo = (videoId) => {
    return new Promise((resolve, reject) => {
        db.run(`DELETE FROM videos WHERE video_id = ?`, [videoId], (err) => {
            if (err) {
                console.log('deleteVideo: ошибка', err)
                reject(err)
                return
            }
            console.log('deleteVideo: ok')
            resolve()
        });
    })
}

export const closeDatabase = () => db.close();

