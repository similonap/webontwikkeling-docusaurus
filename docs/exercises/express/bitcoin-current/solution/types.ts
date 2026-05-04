export interface RootObject {
    bpi: Bpi;
    time: Time;
    disclaimer: string;
    chartName: string;
}

export interface Time {
    updated: string;
    updatedISO: string;
    updateduk: string;
}

export interface Bpi {
    USD: Price;
    GBP: Price;
    EUR: Price;
}

export interface Price {
    code: string;
    symbol: string;
    rate: string;
    description: string;
    rate_float: number;
}
    