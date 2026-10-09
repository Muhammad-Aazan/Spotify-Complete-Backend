const musicModel = require("../models/music.model");
const jwt = require("jsonwebtoken");
const albumModel = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" })
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (jwtErr) {
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" })
    }

    if (decoded.role !== "artist") {
        return res.status(403).json({ message: "You don't have access to create music. Artist role required." })
    }

    const { title } = req.body || {};
    const file = req.file;

    if (!title) {
        return res.status(400).json({ message: "Title is required in form-data" });
    }

    if (!file) {
        return res.status(400).json({ message: "Music file is required. Please upload audio with key 'music' in form-data" });
    }

    try {
        const result = await uploadFile(file.buffer.toString('base64'))

        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        });

        return res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        });
    } catch (err) {
        console.error("Music upload error:", err);
        return res.status(500).json({ message: "Failed to upload music", error: err.message });
    }
}

async function createAlbum(req, res) {


    const { title, musics } = req.body;

    const album = await albumModel.create({
        title,
        musics: musics,
        artist: req.user.id
    });

    res.status(201).json({
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            musics: album.musics,
            artist: album.artist
        }
    });
}

async function getAllMusic(req, res) {
    const musics = await musicModel.find().skip(0).limit(2)//.populate("artist", "name email");

    res.status(200).json({
        message: "All music retrieved successfully",
        musics: musics
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find();

    res.status(200).json({
        message: "All albums retrieved successfully",
        albums: albums
    });
}

module.exports = { createMusic, createAlbum, getAllMusic, getAllAlbums };