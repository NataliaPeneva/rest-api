const Joi = require("joi")
const express = require("express")
const app = express()

app.use(express.json())

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
]

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/api/courses", (req, res) => {
  res.send(courses)
})

app.get("/api/courses/:id", (req, res) => {
  //   res.send(req.params.id) // returns a string
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send("The course with this ID can't be found")
  res.send(course)
})

app.get("/api/posts/:year/:month", (req, res) => {
  res.send(req.params)
  //   res.send(req.query)
})

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body)

  if (error) return res.status(400).send(error.details[0].message)
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  }
  courses.push(course)
  res.send(course)
})

app.put("/api/courses/:id", (req, res) => {
  let course = courses.find((c) => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send("The course with this ID can't be found")

  const { error } = validateCourse(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  course.name = req.body.name // course = { ...course, ...req.body }

  res.send(course)
})

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id))
  if (!course)
    return res.status(404).send("The course with this ID can't be found")

  const index = courses.indexOf(course)
  courses.splice(index, 1)
  res.send(course) // should it be return res.status(204)?
})

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  })
  return schema.validate(course)
}

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`))
