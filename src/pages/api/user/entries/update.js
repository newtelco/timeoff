const db = require('../../../../lib/db')
const escape = require('sql-template-strings')

module.exports = async (req, res) => {
  const body = JSON.parse(req.body)
  const editData = body.editData
  const lastYear = editData.lastYear
  const thisYear = editData.thisYear
  const total = editData.total
  const requested = editData.requested
  const remaining = editData.remaining
  const id = editData.id
  const from = editData.from
  const to = editData.to
  const notes = editData.note
  const files = body.files
  const approved = editData.approved

  let updateQuery
  if (approved == 0) {
    updateQuery = await db.query(escape`
      UPDATE vacations SET resturlaubVorjahr = ${lastYear}, jahresurlaubInsgesamt = ${thisYear}, restjahresurlaubInsgesamt = ${total}, beantragt = ${requested}, resturlaubJAHR = ${remaining}, fromDate = ${from}, toDate = ${to}, note = ${notes}, files = ${files} WHERE id LIKE ${id}
    `)
  } else {
    updateQuery = await db.query(escape`
      UPDATE vacations SET note = ${notes}, files = ${files} WHERE id LIKE ${id}
    `)
  }
  res.status(200).json({ updateQuery })
}