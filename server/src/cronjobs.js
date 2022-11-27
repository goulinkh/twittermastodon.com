const schedule = require("node-schedule")
const { registeredAppDB } = require("./mastodon/oauth")
const { twitterOAuthDB } = require("./twitter/oauth")
const path = require("path")
const fs = require("fs/promises")

// every day at 8AM: backup DBs
schedule.scheduleJob("0 8 * * *", async () => {
  try {
    const backupDir = path.join(process.env.BACKUP_DIR)
    await fs.mkdir(backupDir, { recursive: true })
    const now = Date.now()
    await registeredAppDB.backup(
      path.join(backupDir, `${now}.mastodon.apps.db`)
    )
    console.log(
      `${now.toLocaleString()} backup done successfully to ${backupDir}`
    )
  } catch (e) {
    console.error("failed to perform DB backup:", e)
  }
})

// every hour: cleanup old twitter challenge codes from the DB
schedule.scheduleJob("0 * * * *", async () => {
  twitterOAuthDB.exec(
    "DELETE FROM twitter_oauth WHERE createdAt < DATETIME('now','-1 hour')"
  )
})
