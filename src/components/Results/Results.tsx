import * as React from 'react';
import { observer } from 'mobx-react';
import './Results.css';
import { print } from '../../tools/print';
import { DataModel } from '../../model/DataModel';
import { Loading } from '../Loading/Loading';

export const Results = observer((props: { dataModel: DataModel }) => {
    const correctAnswer = (answer: boolean | null) =>
        answer === true || answer === false;

    return (
        <div className="Results" id="results">
            <h1>Volební kalkulačka 2017</h1>

            <button onClick={print}>Vytisknout</button>

            <button onClick={() => (props.dataModel.phase = 1)}>Znovu</button>

            {props.dataModel.answers!.some(correctAnswer) && (
                <div className="warning">
                    Některé odpovědi({props.dataModel
                        .answers!.map(
                            (answer, answerIndex) =>
                                correctAnswer(answer)
                                    ? null
                                    : answerIndex.toString(),
                        )
                        .filter((part) => part)
                        .join(', ')}) jsme nemohli načíst nebo jste je
                    nenalepili či nalepili oboje.
                </div>
            )}

            <div>
                {props.dataModel.preferencesHtml ? (
                    <div
                        dangerouslySetInnerHTML={{
                            __html: props.dataModel.preferencesHtml,
                        }}
                    />
                ) : (
                    <Loading />
                )}
            </div>
        </div>
    );
});
