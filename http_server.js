#!/usr/bin/env node

// Copyright (C) 2017-2023 Smart code 203358507

const INDEX_CACHE = 7200;
const ASSETS_CACHE = 2629744;
const HTTP_PORT = 8080;

const express = require('express');
const path = require('path');
const fs = require('fs');

const build_path = path.resolve(__dirname, 'build');
const index_path = path.join(build_path, 'index.html');

const app = express();

// Dynamically inject the streaming server URL into index.html
app.get(['/', '/index.html'], (req, res) => {
    fs.readFile(index_path, 'utf8', (err, html) => {
        if (err) {
            return res.status(500).send('Error loading index.html');
        }

        let streamingServerUrl = '';
        const configPath = '/etc/stremio-config/stremio-server-url.txt';
        try {
            if (fs.existsSync(configPath)) {
                streamingServerUrl = fs.readFileSync(configPath, 'utf8').trim();
            }
        } catch (e) {
            console.error('Error reading streaming server URL:', e);
        }

        const injectScript = `<script>window.STREMIO_STREAMING_SERVER_URL = ${JSON.stringify(streamingServerUrl)};</script>`;
        const modifiedHtml = html.replace('</head>', `${injectScript}</head>`);
        
        res.set('cache-control', `public, max-age: ${INDEX_CACHE}`);
        res.send(modifiedHtml);
    });
});

// Serve other static files
app.use(express.static(build_path, {
    setHeaders: (res, filePath) => {
        if (filePath !== index_path) {
            res.set('cache-control', `public, max-age: ${ASSETS_CACHE}`);
        }
    }
}));

app.all('*', (_req, res) => {
    // TODO: better 404 page
    res.status(404).send('<h1>404! Page not found</h1>');
});

app.listen(HTTP_PORT, () => console.info(`Server listening on port: ${HTTP_PORT}`));
