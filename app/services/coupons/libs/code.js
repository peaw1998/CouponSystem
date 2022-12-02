const _ = require("lodash")

const generateCode = (type, quantity) => {
    const code = []
    const test  = uniqueId()
    if (type === "1") {
        const newCode = "1" + uniqueId()
        code.push(newCode)
    } else if(type === "2"){
       for(let i = 0; i< quantity ;i++){
            const newCode = "2" + uniqueId() + i
            code.push(newCode)
       }
    }
    return code
}

const uniqueId = () => {
    const timeString = Date.now().toString(36);
    return _.toUpper(timeString);
}

module.exports = {
    generateCode
}
