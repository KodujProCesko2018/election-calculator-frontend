import { observable, computed } from 'mobx';
import * as superagent from 'superagent';
import { QUESTION_ID_ORDER } from '../config';

export enum AppScreen {
    CAMERA,
    UPLOADING,
    RESULTS,
}

export class DataModel {
    @observable phase: AppScreen;
    @observable answers: (boolean | null)[] | null;
    @observable preferencesHtml: string | null;

    //todo errors

    constructor() {
        this.restart();
    }

    restart() {
        this.phase = AppScreen.CAMERA;
        this.answers = null;
        this.preferencesHtml = null;
    }

    async loadAnswersFromImage(imageData: string) {
        this.phase = AppScreen.UPLOADING;

        const result = await superagent
            .get(`xxxxxxx`)
            .set('Content-Type', 'multipart/form-data')
            .send({ image: imageData });
        const answers = JSON.parse(result.body);

        //todo check answers;

        this.answers = answers;
        this.phase = AppScreen.RESULTS;
        this.loadPreferencesHtml();
    }

    @computed get answersQuery():string{

        if (!this.answers) {
            throw new Error(
                `loadPreferencesHtml should be called after loadAnswersFromImage.`,
            );
        }

        if (QUESTION_ID_ORDER.length !== this.answers.length) {
            throw new Error(
                `On sheet there was ${
                    this.answers.length
                } answers but in config are ${
                    QUESTION_ID_ORDER.length
                } answers.`,
            );
        }

        const query = {};

        this.answers.forEach((answer, i) => {
            if (answer) {
                query[QUESTION_ID_ORDER[i].toString()] = answer ? 1 : -1;
            }
        });

        //'{"1":-1,"11":1}'
        return JSON.stringify(query);
    }

    async loadPreferencesHtml() {
        const result = await superagent
            .get(`https://volebnikalkulacka.cz/hackathon-2018/?key=hackathon`)
            .send({ q: this.answersQuery,key: 'hackathon'});//todo dynamic event
        this.preferencesHtml = result.body;
    }
}