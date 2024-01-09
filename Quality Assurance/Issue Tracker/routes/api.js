"use strict";
require("dotenv").config();
const mongoose = require("mongoose");
const { Project } = require("../models/Project.js");
const { Issue } = require("../models/Issue.js");

mongoose
    .connect(process.env.MONGO_URI)
    .catch((error) => console.log("ERROR while connecting to DB", error));

module.exports = function (app) {
    app
        .route("/api/issues/:project")

        .get(async function (req, res) {
            const projectName = req.params.project;
            const {
                _id,
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
                open,
            } = req.query;
            const openBoolean = open != undefined ? open !== "false" : undefined; // Turn string to a boolean. If 'false' entered the boolean is false, else boolean is true
            const project = await Project.findOne({ name: projectName }); // Get a project with given projectName

            if (project == null) {
                return res.json({ error: "No project with that name found" });
            }

            project.issues = project.issues.filter((issue) => {
                if (_id != undefined && issue._id != _id)
                    return false;
                if (issue_title != undefined && issue.issue_title != issue_title)
                    return false;
                if (issue_text != undefined && issue.issue_text != issue_text)
                    return false;
                if (created_by != undefined && issue.created_by != created_by)
                    return false;
                if (assigned_to != undefined && issue.assigned_to != assigned_to)
                    return false;
                if (status_text != undefined && issue.status_text != status_text)
                    return false;
                if (openBoolean != undefined && issue.open != openBoolean) return false;
                return true;
            });

            return res.json(project.issues);
        })

        .post(async function (req, res) {
            const projectName = req.params.project;
            let { issue_title, issue_text, created_by, assigned_to, status_text } =
                req.body;

            // Validate if required fields are empty
            if (
                issue_title === "" ||
                issue_title === undefined ||
                issue_text === "" ||
                issue_text === undefined ||
                created_by === "" ||
                created_by === undefined
            ) {
                return res.json({ error: "required field(s) missing" });
            }

            if (assigned_to == undefined) assigned_to = "";
            if (status_text == undefined) status_text = "";

            // Create the new issue
            let issue = new Issue({
                issue_title,
                issue_text,
                created_by,
                assigned_to,
                status_text,
            });

            // Find project with given projectName
            let project = await Project.findOne({ name: projectName }).exec();
            if (project == null) {
                // Create new project if non is found with given projectName
                project = new Project({ name: projectName });
            }

            // Add new issue to the project
            project.issues.push(issue);

            // Save edited or created project
            try {
                await project.save();
            } catch (error) {
                console.log(error);
                return res.json({
                    error: "An error occurred while saving to the database",
                });
            }

            return res.json(issue);
        })

        .put(async function (req, res) {
            const projectName = req.params.project;
            const data = req.body;
            if (!data._id) return res.json({ error: "missing _id" });

            // Checks if all input is empty string
            const areAllValuesEmptyExceptId = Object.entries(data)
                .filter(([key]) => key !== "_id") // Exclude _id
                .every(([_, value]) => value === ""); // Check if all other values are empty strings
            if (areAllValuesEmptyExceptId)
                return res.json({ error: "no update field(s) sent", _id: data._id });

            const project = await Project.findOne({ name: projectName });

            if (project == null) {
                return res.json({ error: "No project with that name found" });
            }

            for (let i = 0; i < project.issues.length; i++) {
                if (project.issues[i]._id == data._id) {
                    if (data.issue_title !== "" && data.issue_title !== undefined) {
                        project.issues[i].issue_title = data.issue_title;
                    }
                    if (data.issue_text !== "" && data.issue_text !== undefined) {
                        project.issues[i].issue_text = data.issue_text;
                    }
                    if (data.created_by !== "" && data.created_by !== undefined) {
                        project.issues[i].created_by = data.created_by;
                    }
                    if (data.assigned_to !== "" && data.assigned_to !== undefined) {
                        project.issues[i].assigned_to = data.assigned_to;
                    }
                    if (data.status_text !== "" && data.status_text !== undefined) {
                        project.issues[i].status_text = data.status_text;
                    }
                    if (data.open !== "" && data.open !== undefined) {
                        const openBoolean = data.open == "true";
                        project.issues[i].open = openBoolean;
                    }
                    project.issues[i].updated_on = new Date();

                    return await project.save().then(
                        () => {
                            return res.json({
                                result: "successfully updated",
                                _id: data._id,
                            });
                        },
                        (error) => {
                            console.log(error);
                            return res.json({ error: "could not update", _id: data._id });
                        },
                    );
                }
            }
            return res.json({ error: "could not update", _id: data._id });
        })

        .delete(async function (req, res) {
            const projectName = req.params.project;
            const _id = req.body._id;
            if (!_id) return res.json({ error: "missing _id" });

            const project = await Project.findOne({ name: projectName });

            if (project == null) {
                return res.json({ error: "No project with that name found" });
            }

            for (let i = 0; i < project.issues.length; i++) {
                if (project.issues[i]._id == _id) {
                    // Remove the issue
                    project.issues.splice(i, 1);
                    await project.save().catch((error) => {
                        console.log(error);
                        return res.json({ error: "could not delete", _id: _id });
                    });
                    return res.json({ result: "successfully deleted", _id: _id });
                }
            }
            return res.json({ error: "could not delete", _id: _id });
        });
};
