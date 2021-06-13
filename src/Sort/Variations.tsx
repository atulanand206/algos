export const swap = (arr: number[], xp: number, yp: number) => {
    var temp = arr[xp];
    arr[xp] = arr[yp];
    arr[yp] = temp;
}

export const bubble = async (value: number[], callback: (values: number[]) => void) => {
    var i, j;
    const n = value.length;
    for (i = 0; i < n - 1; i++) {
        for (j = 0; j < n - i - 1; j++) {
            if (value[j] > value[j + 1]) {
                swap(value, j, j + 1);
                callback(value)
                await new Promise(r => setTimeout(r, 200));
            }
        }
    }
}

export const insertion = async (value: number[], callback: (values: number[]) => void) => {
    let i, key, j;
    const n = value.length;
    for (i = 1; i < n; i++) {
        key = value[i];
        j = i - 1;
        while (j >= 0 && value[j] > key) {
            value[j + 1] = value[j];
            j = j - 1;
            // callback(value)
            // await new Promise(r => setTimeout(r, 200));
        }
        value[j + 1] = key;
        callback(value)
        await new Promise(r => setTimeout(r, 200));
    }
}