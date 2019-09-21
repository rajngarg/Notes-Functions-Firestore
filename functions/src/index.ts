
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

const serviceAccount = require('../service_account.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://notes-api-eb2cf.firebaseio.com"
});

const db = admin.firestore().collection('Notes');

export const create = functions.region('asia-east2').https.onRequest((req, res) => {
    const data = {
        title: req.query.title,
        note: req.query.note
    };
    db.doc().set(data).then(s => {
        res.send({ 'status': true, 'message': 'Note added successfully' })
    }).catch(() =>
        res.send({ 'status': false, 'message': 'Use Param title and note' })
    )
})

export const readAll = functions.region('asia-east2').https.onRequest((req, res) => {
    const docArr: any[] = []
    db.listDocuments().then(snapshot => {
        snapshot.forEach(doc => {
            doc.get().then(data => {
                let obj: any
                const content: any = data.data()
                obj = { 'id': doc.id, content }
                docArr.push(obj)
            }).then(() => {
                if (snapshot.length === docArr.length)
                    res.send(docArr)
            }).catch(() => res.send())
        });
    }).catch(reason =>
        res.send({ 'Error': reason })
    )
})

export const readOne = functions.region('asia-east2').https.onRequest((req, res) => {
    let docItem: any = {}
    db.listDocuments().then(snapshot => {
        snapshot.forEach(doc => {
            if (doc.id === req.query.id) {
                doc.get().then(data => {
                    const content: any = data.data()
                    docItem = { 'id': doc.id, content }
                }).then(() => {
                    res.send(docItem)
                }).catch(() => res.send())
            }
        });
    }).catch(reason =>
        res.send({ 'Error': reason })
    )
})

export const deleteOne = functions.region('asia-east2').https.onRequest((req, res) => {
    db.listDocuments().then(snapshot => {
        snapshot.forEach(doc => {
            if (doc.id === req.query.id) {
                doc.delete().then(() => {
                    res.send({ 'status': true, 'message': 'Deleted Successfully' })
                }).catch(() => {
                    res.send({ 'status': false, 'message': 'Error Occured' })
                })
            }
        });
    }).catch(reason =>
        res.send({ 'Error': reason })
    )
})

export const deleteAll = functions.region('asia-east2').https.onRequest((req, res) => {
    db.listDocuments().then(snapshot => {
        const lastId = snapshot[snapshot.length - 1].id
        snapshot.forEach(doc => {
            doc.delete().then(() => {
                if (doc.id === lastId) {
                    res.send({ 'status': true, 'message': 'All Notes Deleted' })
                }
            }).catch(() => {
                res.send({ 'status': false, 'message': 'Error Occured' })
            })
        });
    }).catch(() =>
        res.send({ 'Error': 'Error Occured' })
    )
})

export const update = functions.region('asia-east2').https.onRequest((req, res) => {
    const data = {
        title: req.query.title,
        note: req.query.note
    };
    db.doc(req.query.id).update(data).then(s => {
        res.send({ 'status': true, 'message': 'Note Updated successfully' })
    }).catch(() =>
        res.send({ 'status': false, 'message': 'Use Param title and note' })
    )
})

