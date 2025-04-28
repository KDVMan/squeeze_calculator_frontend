import { DirectionEnum } from '@core/enums/direction.enum';

export class QuoteModel {
    timeOpen: number;
    timeClose: number;
    priceOpen: number;
    priceHigh: number;
    priceLow: number;
    priceClose: number;
    priceAverageOpenClose: number;
    priceAverageHighLow: number;
    volumeLeft: number;
    volumeRight: number;
    volumePrice: number;
    volumeBuyLeft: number;
    volumeBuyRight: number;
    volumeBuyPrice: number;
    volumeSellLeft: number;
    volumeSellRight: number;
    volumeSellPrice: number;
    bodySize: number;
    stickUpSize: number;
    stickDownSize: number;
    stickRatio: number;
    candleSize: number;
    candleBodyRange: number;
    trades: number;

    public static getDirection(priceOpen: number, priceClose: number): DirectionEnum {
        if (priceClose >= priceOpen) return DirectionEnum.up;
        return DirectionEnum.down;
    }
}
