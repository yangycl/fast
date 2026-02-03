"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    type;
    value;
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
class TokenIzer {
    code;
    static keyWordList = [
        "while",
        "if",
        "el",
        "eif",
    ];
    static conditionOperation = [
        "==",
        "!=",
        "<=",
        ">="
    ];
    pos = 0;
    currentChar = "";
    twoChar = "";
    get nextChar() {
        return this.code[this.pos + 1] ?? "";
    }
    constructor(code) {
        this.code = code;
        this.currentChar = code[0] ?? "";
        this.twoChar = this.currentChar + this.nextChar;
    }
    advance() {
        this.pos++;
        this.currentChar = this.code[this.pos] ?? "";
        this.twoChar = this.currentChar + this.nextChar;
    }
    number() {
        let result = "";
        while (/\d/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        return new Token("numberValue", result);
    }
    identifier() {
        let result = "";
        while (/[a-zA-Z]/.test(this.currentChar)) {
            result += this.currentChar;
            this.advance();
        }
        if (TokenIzer.keyWordList.includes(result)) {
            return new Token("keyWord", result);
        }
        return new Token("identifierValue", result);
    }
    string() {
        const quote = this.currentChar;
        let result = "";
        this.advance(); // skip opening quote
        while (this.currentChar !== quote && this.currentChar !== "") {
            result += this.currentChar;
            this.advance();
        }
        this.advance(); // skip closing quote
        return new Token("stringValue", result);
    }
    operator() {
        const op = this.currentChar;
        if (TokenIzer.conditionOperation.includes(this.twoChar)) {
            const op = this.twoChar; // 先存 "=="
            this.advance(); // 移動不會影響 op 了
            this.advance();
            return new Token("conditionOperation", op);
        }
        this.advance();
        return new Token("operatorValue", op);
    }
    EOF() {
        return new Token("EOFValue", "");
    }
    tokenize() {
        const tokenArr = [];
        while (this.currentChar !== "") {
            // 跳過空白
            if (/\s/.test(this.currentChar)) {
                this.advance();
                continue;
            }
            // 數字
            if (/\d/.test(this.currentChar)) {
                tokenArr.push(this.number());
                continue;
            }
            // 字串
            if (this.currentChar === '"' || this.currentChar === "'") {
                tokenArr.push(this.string());
                continue;
            }
            // 識別字
            if (/[a-zA-Z]/.test(this.currentChar)) {
                tokenArr.push(this.identifier());
                continue;
            }
            // 運算符
            if ("+-*/".includes(this.currentChar)) {
                tokenArr.push(this.operator());
                continue;
            }
            throw new Error("Unknown character: " + this.currentChar);
        }
        tokenArr.push(this.EOF());
        return tokenArr;
    }
}
let token = new TokenIzer("1 + 5").tokenize();
console.log(token);
//# sourceMappingURL=index.js.map