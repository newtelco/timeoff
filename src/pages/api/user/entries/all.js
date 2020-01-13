const db = require('../../../../lib/db')
const escape = require('sql-template-strings')

module.exports = async (req, res) => {
  const userEntries = await db.query(escape`
    SELECT * FROM vacations WHERE disabled LIKE 0
  `)
  res.status(200).json({ userEntries })
}
