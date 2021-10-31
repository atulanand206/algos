const Bearer = "Bearer "

function authorizationHeaderValue() {
    return Bearer + sessionStorage.getItem('access_token');
}

export function getHeader() {
    return {Authorization: authorizationHeaderValue()};
}

export function postHeader() {
    return {
        "Content-Type": "application/json",
        Authorization: authorizationHeaderValue()
    };
}