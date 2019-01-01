const getBin = (n, pad) => {
    // returns the binary representation of a base ten digit 'n', where 0 < n <= 59
    // ... returns the representation in accordance to some padding 'pad'
    // ... the padding provides the limit for the length of our binary representation

    // Lets store the actual base ten value for later
    let init_n = n
    // if our value (n) is zero then we stock up the representaion with '0' to avoid under-padding the result
    let val = n == 0 ? '0' : ''

    // This is the actual process of beefing up the binary representation
    while (n > 0) {
        val = String(n%2) + val
        n = Math.trunc(n/2)
    }

    // This is the important part for our padding
    // We determine a padding `limiter` to avoid over-padding; adding more zeros than normal
    let lim = init_n >= 8 ? 4 : init_n >= 4 ? 3 : init_n >= 2 ? 2 : 1

    // We finally obtain the number of zeros to pad the result to ensure it fits the padding 'pad'
    let padded = ''
    for (var i = 0;i<(pad-lim);i++) padded += '0'

    // We finally return the actual representation and any necessary padded zeros
    return padded + val
}

const getLeft = (n) => {
    // Assumes n < 100
    return Math.trunc(n/10)
}

const getRight = (n) => {
    // Assumes n < 100
    return n % 10
}

const getTime = () => {
    // actual raw date has the time as well
    let tmp_time = Date()

    // We obtain the time by stripping all words and further obtain it by splitting
    // the fourth word (time) according to the colon (:) that seperates the time
    let str_time = tmp_time.split(/\b /)[4].split(':')

    // We transform this list of strings [hh, mm, ss] into a list of numbers
    return str_time.map((t) => { return Number(t) })
}

const getPads = (clockType) =>  {
    // Assumes clockType to be of type String
    // clockType is either 24 hrs (00:00:00 - 23:00:00) else 12 hrs (AM/PM)

    let fullClock = {
        'hrs': {
            'left': 2, // 24 hr clocks have a maximum value of '2' on the left
            'right': 4
        },
        'mins': {
            'left': 3,
            'right': 4
        },
        'secs': {
            'left': 3,
            'right': 4
        }
    }

    let halfClock = {
        'hrs': {
            'left': 1, // 24 hr clocks have a maximum value of '1' on the left
            'right': 4
        },
        'mins': {
            'left': 3,
            'right': 4
        },
        'secs': {
            'left': 3,
            'right': 4
        },
        'carry': 1 // For specifying whether its AM (Off) or PM (On)
    }

    return clockType == '24' ? fullClock : halfClock
}

const getClock = (clockType) => {
    return clockType == '24' ? {
        'hrs': { 'left': null, 'right': null },
        'mins': { 'left': null,'right': null },
        'secs': { 'left': null, 'right': null }
    } : {
        'hrs': { 'left': null, 'right': null },
        'mins': { 'left': null,'right': null },
        'secs': { 'left': null, 'right': null },
        'carry': null
    }
}

const buildClock = (clockType='24', time) => {
    // Assumes time is of the form:-
    // [ hrs, mins, secs ], where hrs, mins, and secs are all Number types
    let pads = getPads(clockType)
    let tmp_clock = getClock(time, clockType)

    // inorder to translate the index into the appropriate key
    let keys = {
        '0': 'hrs',
        '1': 'mins',
        '2': 'secs'
    }

    // if no time argument was given we use our internal clock function
    time = time == undefined ? getTime() : time

    // fill in the carry ('AM'/'PM')
    // ... this feild should be ignored in the case of the '24 hr' clock
    tmp_clock['carry'] = getBin(getLeft(time[0]), pads.hrs['left'])[0]

    // We walk each key ('hour', 'minute', 'second')
    for (var i = 0;i < 3;i++) {
        // We determine the key by indexing the 'keys' hashMap
    	let key = keys[i]

        // we fill in the left and right values of each key
    	tmp_clock[key]['left'] = getBin(getLeft(time[i]), pads[key]['left'])
    	tmp_clock[key]['right'] = getBin(getRight(time[i]), pads[key]['right'])
    }

    // Return the properly formatted `clock`
    return tmp_clock
}

const binclockjs = {
    Clock: getClock,
    pads: getPads,
    buildClock: buildClock,
    getTime: getTime,
    getLeft: getLeft,
    getRight: getRight,
    getBin: getBin
}

// Check for Browser or NodeJS
typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = { getClock, getPads, buildClock, getTime, getBin, getLeft, getRight } : window.binclockjs = binclockjs
