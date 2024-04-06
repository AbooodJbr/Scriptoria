import { useState, useEffect } from "react";
import validator from "validator";
import { findAccount } from "../../api/accountApi";
import EmailVerification from "../email-verification/EmailVerification";
import { useNavigate, useParams } from "react-router-dom"
import { sendEmail } from "../../api/API's";
import { useTranslation } from 'react-i18next';

const EmailVerifing = () => {
    const { t } = useTranslation();
    const { email } = useParams();
    const [validEmail, setValidEmail] = useState(undefined);
    const [userCode, setUserCode] = useState("")
    const [generatedCode, setGeneratedCode] = useState("")

    const [inputColor, setInputColor] = useState("#cad0ff")
    const [inputError, setInputError] = useState("")
    const navigate = useNavigate()
    useEffect(() => {
        async function checkEmailValidity() {
            if (!validator.isEmail(email)) {
                setValidEmail(undefined);
                return;
            }

            try {
                const res = await findAccount({ email });
                if (res.status === 404) {
                    setValidEmail(undefined);
                } else {
                    setValidEmail(email);
                }
            } catch (error) {
                console.error("Error occurred while checking email validity:", error);
                setValidEmail(undefined);
            }
        }
        generateCode();
        checkEmailValidity();
    }, [email]);

    useEffect(() => {
        if (validEmail) {
            sendVerificationCode();
        }
    },);

    const generateCode = () => {
        let allChar = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789"];
        let code = "";
        for (let i = 0; i < 4; i++) {
            let indexForAllChar = Math.floor(Math.random() * allChar.length);
            let temp = allChar[indexForAllChar]
            code += temp[Math.floor(Math.random() * temp.length)]
        }
        setGeneratedCode(code)
    }

    const sendVerificationCode = async () => {
        const emailDetails = {
            email,
            codeGenerated: generatedCode
        };
        try {
            await sendEmail("account/recovery", emailDetails);
            console.log("Email sent successfully");
        } catch (error) {
            console.error("Error occurred while sending email:", error);
        }
    };

    const compareHandler = () => {
        if (userCode === generatedCode) {
            navigate(`/ResetPassword`, { state: { email } })
            return
        }
        setInputColor("red")
        setInputError(t("EmailVerifing.InputError"))
    }
    const codeResendHandler = () => {
        sendVerificationCode()
    }
    if (validEmail !== undefined) {
        return (
            <EmailVerification
                cardType={t("EmailVerifing.cardType")}
                type="email"
                text={t("EmailVerifing.text")}
                inputPlaceholder={t("EmailVerifing.inputPlaceholder")}
                methodOnChange={setUserCode}
                buttonTitle={t("EmailVerifing.buttonTitle")}
                buttonTitle2={t("EmailVerifing.buttonTitle2")}
                methodOnClick={compareHandler}
                methodOnClick2={codeResendHandler}
                inputColor={inputColor}
                inputError={inputError}
            />
        );
    } else {
        navigate('*')
        return null
    }
};

export default EmailVerifing;
