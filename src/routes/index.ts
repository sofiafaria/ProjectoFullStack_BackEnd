import { Router } from "express";
import {body, param, sanitizeBody } from 'express-validator';
import passport from "passport";
import AppController from "../controller/app.controller";
import AuthController from "../controller/auth.controller";
import LessonController from "../controller/lesson.controller";
import UserController from "../controller/user.controller";
import QuizController from "../controller/quiz.controller";
import QuestionController from "../controller/question.controller";
import upload from "../core/file/helper";

const router = Router();

router.get('/', AppController.welcome);

//Auth
 router.post('/auth/register', [body('name').isString(),
                                body('email').isString(),
                                body('is_admin').isBoolean(),
                                body('username').isAlphanumeric(),
                                body('password').isString(),
 sanitizeBody('name')],AuthController.register);
 router.post('/auth/authenticate',[body('username').isAlphanumeric(),
                                    body('password').isString()], AuthController.authenticate);
// router.get('/auth/validate', AuthController.validate);

//Lesson
router.get('/lessons', passport.authenticate('jwt', {session: false}), LessonController.getAll);
router.post('/lessons', passport.authenticate('jwt', {session: false}),[body('name').isString(),
                        body('group').isString(),
                        body('description').isString(),
                        body('level').isInt(),
                        body('links.*').isString(),
                        sanitizeBody('description')], LessonController.create);
router.post('/lesson/:id/uploadFile',passport.authenticate('jwt', {session: false}), upload , LessonController.createFile);
router.delete('/lesson/:id/deleteFile/:fileId',passport.authenticate('jwt', {session: false}) , LessonController.deleteFile);
router.get('/lesson/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], LessonController.getOne);
router.put('/lesson/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], LessonController.update);
router.delete('/lesson/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], LessonController.delete);
// router.put('/lesson/inactive/:id',[param('id').isMongoId()], LessonController.inactive);
// router.put('/lesson/active/:id',[param('id').isMongoId()], LessonController.active);

//User
router.get('/users', passport.authenticate('jwt', {session: false}), UserController.getAll);
router.put('/user/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()],UserController.update);
router.delete('/user/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()],UserController.delete);
router.get('/user/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()], UserController.getOne);
// router.put('/users/active/:id',[param('id').isMongoId()], UserController.active);
// router.put('/users/inactive/:id',[param('id').isMongoId()], UserController.inactive);

//Quiz
router.get('/quizzes', passport.authenticate('jwt', {session: false}), QuizController.getAll);
router.post('/quizzes', passport.authenticate('jwt', {session: false}), [body('name').isString(),
                        body('points').isInt(),
                        body('lesson').isMongoId(),
                        body('level').isInt(),
                        body('questions.*._id').isMongoId()
                    ],QuizController.create);
router.get('/quiz/lesson/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], QuizController.getOneByLessonId);
router.put('/quiz/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()],QuizController.update);
router.delete('/quiz/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()],QuizController.delete);
router.get('/quiz/:id',passport.authenticate('jwt', {session: false}),[param('id').isMongoId()], QuizController.getOne);
// router.put('/quiz/active/:id',[param('id').isMongoId()], QuizController.active);
// router.put('/quiz/inactive/:id',[param('id').isMongoId()], QuizController.inactive);

//Question

router.get('/questions',passport.authenticate('jwt', {session: false}), QuestionController.getAll);
router.post('/questions',passport.authenticate('jwt', {session: false}),[body('question').isString(),
        body('title').isString(),
        body('description').isString(),
        body('type').isString(),
        body('group').isString(),
        body('level').isInt(),
        body('answers.*.title').isString(),
        body('answers.*.description').isString(),
        body('answers.*.correct').isBoolean()
    ], QuestionController.create);
router.put('/question/:id', passport.authenticate('jwt', {session: false}),[param('id').isMongoId()], QuestionController.update);
router.delete('/question/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], QuestionController.delete);
router.get('/question/:id',passport.authenticate('jwt', {session: false}), [param('id').isMongoId()], QuestionController.getOne);
// router.put('/question/inactive/:id' ,[param('id').isMongoId()], QuestionController.inactive);
// router.put('/question/activate/:id', [param('id').isMongoId()], QuestionController.active);  


//All others go to
router.get('*', AppController.welcome);

export default router;