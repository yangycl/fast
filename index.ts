class Token {
    constructor(public type: string, public value: string) {}
}

class TokenIzer {
    static keyWordList = [
        "while",
        "if", 
        "el",
        "eif",
    ]

    static conditionOperation = [
        "==",
        "!=",
        "<=",
        ">="
    ]

    public pos: number = 0
    public currentChar: string = ""
    public twoChar: string = "" 

    get nextChar() {
        return this.code[this.pos + 1] ?? ""
    }

    constructor(public code: string) {
        this.currentChar = code[0] ?? ""
        this.twoChar = this.currentChar + this.nextChar;
    }


    
    advance(): void {
        this.pos++
        this.currentChar = this.code[this.pos] ?? ""
        this.twoChar = this.currentChar + this.nextChar;
    }

    private number(): Token {
        let result = ""
        while (/\d/.test(this.currentChar)) {
            result += this.currentChar
            this.advance()
        }
        return new Token("numberValue", result)
    }

    private identifier(): Token {
        let result = ""
        while (/[a-zA-Z]/.test(this.currentChar)) {
            result += this.currentChar
            this.advance()
        }
        if (TokenIzer.keyWordList.includes(result)) {
            return new Token("keyWord", result)
        }
        return new Token("identifierValue", result)
    }

    private string(): Token {
        const quote = this.currentChar
        let result = ""
        this.advance() // skip opening quote

        while (this.currentChar !== quote && this.currentChar !== "") {
            result += this.currentChar
            this.advance()
        }

        this.advance() // skip closing quote
        return new Token("stringValue", result)
    }

    private operator(): Token {
        const op = this.currentChar
        if (TokenIzer.conditionOperation.includes(this.twoChar)){
            const op = this.twoChar  // 先存 "=="
            this.advance()           // 移動不會影響 op 了
            this.advance()
            return new Token("conditionOperation", op)
        }
        this.advance()
        return new Token("operatorValue", op)
    }

    private EOF(): Token {
        return new Token("EOFValue", "")
    }

    tokenize(): Token[] {
        const tokenArr: Token[] = []

        while (this.currentChar !== "") {
            // 大括號
            if (this.currentChar === "{" || this.currentChar === "}") {
                tokenArr.push(new Token("bracket", this.currentChar))
                this.advance()
                continue
            }
            
            // 跳過空白
            if (/\s/.test(this.currentChar)) {
                this.advance()
                continue
            }

            // 數字
            if (/\d/.test(this.currentChar)) {
                tokenArr.push(this.number())
                continue
            }

            // 字串
            if (this.currentChar === '"' || this.currentChar === "'") {
                tokenArr.push(this.string())
                continue
            }

            // 識別字
            if (/[a-zA-Z]/.test(this.currentChar)) {
                tokenArr.push(this.identifier())
                continue
            }

            // 運算符
            if ("+-*/".includes(this.currentChar)) {
                tokenArr.push(this.operator())
                continue
            }

            throw new Error("Unknown character: " + this.currentChar)
        }

        tokenArr.push(this.EOF())
        return tokenArr
    }
}

let token: Token[] = new TokenIzer("1 + 5").tokenize()
console.log(token)
