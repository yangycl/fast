class Token{
    constructor (public type:string, public value:string) {}
}

class TokenIzer{
    public pos: number = 0       // 當前讀取位置
    public currentChar: string = ""

    constructor (public code:string){}
    advance():void{
        this.pos ++;
        this.currentChar = this.currentChar = this.code[this.pos] ?? "";
    }

    segmentation(code = this.code):string[]{
        return code.split(/\s+/);
    }

    private number(codestr:string):Token{
        return new Token("numberValue", codestr)
    }
    
    private string(codestr:string){
        return new Token("stringValue", codestr);
    }

    private identifier (codestr:string){
        return new Token("identifierValue", codestr);
    }  
    private operator(codestr:string){
        return new Token("operatorValue", codestr);
    }

    private EOF(codestr:string){
        return new Token("EOFValue", codestr);
    }


    tokenize(): Token[] {
        const codeArr = this.segmentation();
        const tokenArr: Token[] = [];

        for (let codeUnit of codeArr) {
            if (/^\d+(\.\d+)?$/.test(codeUnit)) {
                tokenArr.push(this.number(codeUnit));
            }
            else if (/^'.*'$/.test(codeUnit) || /^".*"$/.test(codeUnit)) {
                tokenArr.push(this.string(codeUnit));
            }
            else if (/^[a-zA-Z]+$/.test(codeUnit)) {
                tokenArr.push(this.identifier(codeUnit));
            }
            else if (/^[+\-*/]$/.test(codeUnit)) {
                tokenArr.push(this.operator(codeUnit));
            }
            else {
                if(/\+|-|\*|\//.test(codeUnit))
                    tokenArr.push(this.operator(codeUnit));
            }
        }

        tokenArr.push(this.EOF("")); // 最後加 EOF
        console.log(tokenArr)
        return tokenArr;
    }

}
let token:Token[] = new TokenIzer("1 + 5").tokenize()