export enum CalculatorFieldEnum {
    bind = 'bind',
    percentIn = 'percentIn',
    percentOut = 'percentOut',
    stopTime = 'stopTime',
    stopPercent = 'stopPercent',
    total = 'total',
    totalStops = 'totalStops',
    totalStopsMinus = 'totalStopsMinus',
    totalStopsPlus = 'totalStopsPlus',
    totalTakes = 'totalTakes',
    totalTakesPlus = 'totalTakesPlus',
    totalProfitPercent = 'totalProfitPercent',
    totalCumulativeProfitPercent = 'totalCumulativeProfitPercent',
    maxDrawdownPercent = 'maxDrawdownPercent',
    maxTimeDeal = 'maxTimeDeal',
    inOutRatio = 'inOutRatio',
    coefficient = 'coefficient',
    winRate = 'winRate',
    winRatePlus = 'winRatePlus',
    score = 'score'
}

export const calculatorFieldExclusion = {
    filter: [
        CalculatorFieldEnum.bind,
        CalculatorFieldEnum.percentIn,
        CalculatorFieldEnum.percentOut,
        CalculatorFieldEnum.stopTime,
        CalculatorFieldEnum.stopPercent
    ] as Array<keyof typeof CalculatorFieldEnum>,

    formula: [
        CalculatorFieldEnum.bind,
        CalculatorFieldEnum.percentIn,
        CalculatorFieldEnum.percentOut,
        CalculatorFieldEnum.stopTime,
        CalculatorFieldEnum.stopPercent,
        CalculatorFieldEnum.score
    ] as Array<keyof typeof CalculatorFieldEnum>,
};
