import "./css/index.css" //isso é possivel por causa do vite. 
//Para colocar o vite no seu projeto npm create vite@latest
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path");//buscando pelo seletor, estou acessando o g que está no primeiro nivel g que está no sgv
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")//pegando o elemento de imagem
//ccBgColor01.setAttribute("fill", "pink")//atributo que quero atualizar e cor
//ccBgColor02.setAttribute("fill", "blue")//atributo que quero atualizar e cor


function setCardType(type) {
    const colors = {
        "visa": ["#436D99", "#2D57F2"],
        "mastercard": ["#DF6F29", "#C69347"],
        "default": ["black", "gray"],
        "bts": ["#7929DF", "#9E00FF"],
    }

    ccBgColor01.setAttribute("fill", colors[type][0])//atributo que quero atualizar e cor
    ccBgColor02.setAttribute("fill", colors[type][1])//atributo que quero atualizar e cor
    ccLogo.setAttribute("src", `cc-${type}.svg`)//estou mudando a imagem
}

setCardType("default")

//disponibilizando como função global
globalThis.setCardType = setCardType //estou colocando ela no global, pra conseguir acessar pelo dev tools, no inspecionar

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000"
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)//passando os argumentos que o IMask pede

const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {//definindo os padrões
    mask: "MM{/}YY", //definindo a máscara
    blocks: {
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2), //pegando a data , mas só os 2 últimos caracteres
            to: String(new Date().getFullYear() + 10).slice(2) //limitando até o ano que posso ir
        },
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        }
    }
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardtype: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,//o que tá entre parênteses são as possibilidades de iniciar o número do cartão e seus próximos dígitos
            cardtype: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",  
            cardtype: "bts",
        },
        {
            mask: "0000 0000 0000 0000",
            cardtype: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")// \D tudo que não é dígito ele vai substituir por um espaço vazio
        //({regex}) fazendo uma desestruturação para pegar só o regex
        //const foundMask = dynamicMasked.compiledMasks.find(({regex}) => number.match(regex)) -> versão nçao simplificada
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })

        //console.log(foundMask)
        return foundMask
    },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)