import { Controller } from '../../libraries/Controller';
import { BlockedPlace } from '../../models/BlockedPlace';
import { Request, Response, Router, NextFunction } from 'express';
import { validateJWT, onlyLogged } from '../../policies/General';
import { FindAndCountOptions } from 'sequelize/types';
import { Place } from '../../models/Place';
import { Studio } from '../../models/Studio';
import * as yup from 'yup';
import { findActiveReserve, validateYup, perPage } from '../../libraries/util';
import * as moment from 'moment-timezone';
import { Lesson } from '../../models/Lesson';
import { Instructor } from '../../models/Instructor';


export class BlockPlaceController extends Controller {
    constructor() {
        super();
        this.name = 'block';
    }

    routes(): Router {
        this.router.get(
            '/',
            validateJWT('access'),
            onlyLogged(),
            (req: Request, res: Response, next: NextFunction) => {
                this.find(req, res, next);
            }
        );

        this.router.post(
            '/',
            validateJWT('access'),
            onlyLogged(),
            (req: Request, res: Response, next: NextFunction) => {
                this.create(req, res, next);
            }
        );

        this.router.delete(
            '/:id',
            validateJWT('access'),
            onlyLogged(),
            this.loadLockedPlace(),
            (req: Request, res: Response, next: NextFunction) => {
                this.unlock(req, res, next);
            }
        );

        this.router.delete(
            '/enable/:id',
            validateJWT('access'),
            onlyLogged(),
            this.loadLockedPlace(),
            (req: Request, res: Response, next: NextFunction) => {
                this.enable(req, res, next)
            }
        );
        return this.router;
    }

    find = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const query: FindAndCountOptions = {
                where: {
                    lesson_id: req.query.lessonId
                },
                include: [
                    {
                        model: Place,
                        attributes: ['location'],
                        include: [
                            {
                                model: Studio,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
            }

            const blockedPlaces = await BlockedPlace.findAndCountAll(query);
            return Controller.ok(res, null, blockedPlaces.rows, blockedPlaces.count);
        } catch (error) {
            return next(error);
        }
    }

    unlock = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const place = req.session.place as BlockedPlace;
            place.destroy();
            return Controller.noContent(res);
        }
        catch (error) {
            return Controller.serverError(res, 'No se puede desbloquear el lugar');
        }
    }

    enable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const place = req.session.place as BlockedPlace;
            place.destroy();
            return Controller.noContent(res)
        } catch (error) {
            return Controller.serverError(res, 'No se puede habilitar este lugar')
        }
    }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const schema = yup.object().shape({
                lesson_id: yup
                    .number()
                    .positive()
                    .required(),
                place_id: yup
                    .string()
                    .required(),
                visible: yup
                    .boolean()
                    .required()
            });
            try {
                await validateYup(req.body, schema);
            } catch (err) {
                return Controller.badRequest(res, err.name, err.errors);
            }

            const lesson = await Lesson.findOne({
                where: {
                    id: req.body.lesson_id,
                },
                include: [Studio, Instructor],
            });

            if (moment().utcOffset('-05:00').diff(moment(lesson.ends_at).utcOffset('-05:00'), 'minutes') > 0) {
                return Controller.badRequest(res, 'No puedes bloquear el lugar, la clase ha iniciado o ha terminado.');
            }

            if (!lesson) {
                return Controller.badRequest(res, 'La clase seleccionada no es válida.');
            }

            const place = await Place.findOne({ where: { id: req.body.place_id } });

            if (!place) {
                return Controller.badRequest(res, 'El lugar seleccionado no es válido.');
            }

            try {
                await findActiveReserve(req.body.lesson_id, req.body.place_id);
            } catch (error) {
                return Controller.badRequest(
                    res,
                    'El lugar que has seleccionado ha sido reservado.',
                );
            }

            let placeBlocked = new BlockedPlace();
            placeBlocked.lesson_id = req.body.lesson_id;
            placeBlocked.place_id = req.body.place_id;
            placeBlocked.visible = req.body.visible;
            placeBlocked.blocked_at = new Date();

            placeBlocked = await placeBlocked.save();

            Controller.created(res, null, placeBlocked);
        } catch (error) {
            return next(error);
        }
    }

    private loadLockedPlace() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const place = await BlockedPlace.findByPk(req.params.id);
                if (!place) {
                    return Controller.notFound(res);
                }
                req.session.place = place;
                return next();
            } catch (error) {
                return next(error);
            }
        };
    }
}

const controller = new BlockPlaceController;

export default controller;
