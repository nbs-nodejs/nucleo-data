export enum CharacterSetEnum {
    DEFAULT,
    ALPHA,
    ALPHA_NUM,
    ALPHA_NUM_MIXED_CASE,
    NUM,
}

export const CharacterSets = {
    [CharacterSetEnum.ALPHA]: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    [CharacterSetEnum.ALPHA_NUM]: "0123456789abcdefghijklmnopqrstuvwxyz",
    [CharacterSetEnum.ALPHA_NUM_MIXED_CASE]: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    [CharacterSetEnum.NUM]: "0123456789",
};
