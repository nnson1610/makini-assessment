import { expect } from 'chai';
import * as sinon from 'sinon';
import { MainService } from '../main.service';
import { MainRepository } from '../../repository/main.repository';
import Container from "typedi";
import { IntervalUnit } from '../../common/enum';

describe('MainService', () => {
    const mainService = Container.get(MainService);

    describe('buildHierarchy', () => {
        it('should build a hierarchy of models', async () => {
            const models = [{
                recordId: "rec1",
                data: {
                    number: "1"
                }
            }, {
                recordId: "rec2",
                data: {
                    number: "2"
                }
            }];
            const parentChildModels = [
                {
                    recordId: "rec1",
                    data: {
                        number: ["rec2"],
                        parent_number: ["rec1"]

                    }
                }
            ];
            const expectedResult = [{
                children: [
                    {
                        data: {
                            number: models[1].data.number
                        },
                        recordId: models[1].recordId
                    }
                ],
                data: {
                    number: models[0].data.number
                },
                recordId: models[0].recordId
            },
            {
                data: {
                    number: models[1].data.number
                },
                recordId: models[1].recordId
            }];

            const mainRepositoryStub = sinon.stub(Container.get(MainRepository), 'buildHierarchy').resolves({
                models,
                parentChildModels,
            });

            const result = await mainService.buildHierarchy({});

            expect(mainRepositoryStub.calledOnceWithExactly({})).to.be.true;
            expect(result).to.deep.equal(expectedResult);

            mainRepositoryStub.restore();
        });
    });

    describe('getDrawing', () => {
        it('should return a list of drawings and their models', async () => {
            const models = [{
                recordId: "rec1",
                data: {
                    number: "1"
                }
            }];
            const drawings = [
                {
                    recordId: "rec1",
                    data: {
                        name: "draw1",
                        model_model_number: ["rec1"]
                    }
                }
            ];
            const expectedResult = [{
                data: {
                    model_number: [models[0].data.number],
                    name: drawings[0].data.name
                },
                recordId: drawings[0].recordId
            }];

            const mainRepositoryStub = sinon.stub(Container.get(MainRepository), 'getDrawing').resolves({
                models,
                drawings,
            });

            const result = await mainService.getDrawing({});

            expect(mainRepositoryStub.calledOnceWithExactly({})).to.be.true;
            expect(result).to.deep.equal(expectedResult);

            mainRepositoryStub.restore();
        });
    });

    describe('getServicePlanner', () => {
        it('should return a list of dates when services can be done', async () => {
            sinon.useFakeTimers(new Date(1675209600000));
            const services = [{
                recordId: "rec1",
                data: {
                    name: "service1",
                    calendar_interval: 10,
                    calendar_interval_unit: IntervalUnit.DAY
                }
            }];
            const expectedResult = [{
                data: {
                    endDate: "2023-02-10T17:00:00.000Z",
                    name: "service1",
                    startDate: "2023-02-01T00:00:00.000Z"
                },
                recordId: "rec1"
            }];

            const mainRepositoryStub = sinon.stub(Container.get(MainRepository), 'getServicePlanner').resolves({
                services
            });

            const result = await mainService.getServicePlanner({});

            expect(mainRepositoryStub.calledOnceWithExactly({ size: undefined })).to.be.true;
            expect(result).to.deep.equal(expectedResult);

            mainRepositoryStub.restore();
        });
    });

    describe('getServicePlannerEndDate', () => {
        const testCases = [
            { startDate: new Date('2022-02-23T08:00:00.000Z'), interval: 2, intervalUnit: IntervalUnit.HOUR, expectedEndDate: new Date('2022-02-23T10:00:00.000Z') },
            { startDate: new Date('2022-02-23T08:00:00.000Z'), interval: 2, intervalUnit: IntervalUnit.DAY, expectedEndDate: new Date('2022-02-24T17:00:00.000Z') },
            { startDate: new Date('2022-02-23T08:00:00.000Z'), interval: 2, intervalUnit: IntervalUnit.WEEK, expectedEndDate: new Date('2022-03-05T17:00:00.000Z') },
            { startDate: new Date('2022-02-23T08:00:00.000Z'), interval: 2, intervalUnit: IntervalUnit.MONTH, expectedEndDate: new Date('2022-03-31T17:00:00.000Z') },
            { startDate: new Date('2022-02-23T08:00:00.000Z'), interval: 2, intervalUnit: IntervalUnit.YEAR, expectedEndDate: new Date('2023-12-31T17:00:00.000Z') },
        ];

        testCases.forEach((testCase) => {
            it(`should return the correct end date for ${testCase.interval} ${testCase.intervalUnit}`, () => {
                const actualEndDate = mainService.getServicePlannerEndDate(testCase.startDate, testCase.interval, testCase.intervalUnit);
                expect(actualEndDate).to.eql(testCase.expectedEndDate);
            });
        });
    });
});