import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Handle large base64 image payloads
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // API to receive current local storage photos from user's browser
  app.post("/api/sync-photos", (req, res) => {
    try {
      const { memories, avatar, animalSheet, puzzleImages, giftSweetLetters, giftSpiritLetters } = req.body;
      console.log("=== RECEIVED DATA FOR SYNC ===");
      console.dir({
        hasMemories: !!memories,
        memoriesCount: memories?.length,
        hasAvatar: !!avatar,
        avatarLen: avatar?.length,
        hasAnimalSheet: !!animalSheet,
        hasPuzzleImages: !!puzzleImages,
        puzzleCount: puzzleImages?.length,
        hasSweetLetters: !!giftSweetLetters,
        hasSpiritLetters: !!giftSpiritLetters,
      });

      // Write to src/custom_backup.json intelligently (merge instead of overwrite)
      const backupPath = path.join(process.cwd(), "src", "custom_backup.json");
      let currentBackup: any = {};
      if (fs.existsSync(backupPath)) {
        try {
          currentBackup = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
        } catch (e) {
          currentBackup = {};
        }
      }

      // Merge only fields that are provided and not null
      if (memories !== undefined && memories !== null) currentBackup.memories = memories;
      if (avatar !== undefined && avatar !== null) currentBackup.avatar = avatar;
      if (animalSheet !== undefined && animalSheet !== null) currentBackup.animalSheet = animalSheet;
      if (puzzleImages !== undefined && puzzleImages !== null) currentBackup.puzzleImages = puzzleImages;
      if (giftSweetLetters !== undefined && giftSweetLetters !== null) currentBackup.giftSweetLetters = giftSweetLetters;
      if (giftSpiritLetters !== undefined && giftSpiritLetters !== null) currentBackup.giftSpiritLetters = giftSpiritLetters;

      fs.writeFileSync(backupPath, JSON.stringify(currentBackup, null, 2));
      console.log("SUCCESSFULLY SAVED TO", backupPath);

      res.json({ status: "success", count: currentBackup.memories?.length || 0 });
    } catch (error: any) {
      console.error("Error saving synced photos:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Check if saved
  app.get("/api/check-sync", (req, res) => {
    const backupPath = path.join(process.cwd(), "src", "custom_backup.json");
    if (fs.existsSync(backupPath)) {
      try {
        const data = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
        res.json({
          synced: true,
          memoriesCount: data.memories?.length || 0,
          avatarPresent: !!data.avatar,
          hasSweetLetters: !!data.giftSweetLetters,
          hasSpiritLetters: !!data.giftSpiritLetters,
        });
      } catch {
        res.json({ synced: false, error: "Malformed backup file" });
      }
    } else {
      res.json({ synced: false });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
