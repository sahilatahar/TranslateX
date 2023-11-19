import './Translate.scss';
import logo from '../../assets/logo.svg';
import { useEffect, useRef, useState } from 'react';
import TranslationCard from './TranslationCard/TranslationCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Translate = () => {
    const [translationLanguages, setTranslationLanguages] = useState({
        from: { name: 'English', code: 'en' },
        to: { name: 'Hindi', code: 'hi' }
    });
    const [textInput, setTextInput] = useState({ input: '', output: '' });
    const [availableLanguagesList, setAvailableLanguagesList] = useState([]);
    const [showLanguageList, setShowLanguageList] = useState({ input: false, output: false });
    const inputTextAreaRef = useRef(null);
    const outputTextAreaRef = useRef(null);
    const INPUT_CHARACTER_LIMIT = 1000;
    const [isTranslating, setTranslating] = useState(false);

    const handleLanguageChange = ({ isInput, lang }) => {
        if (isInput) {
            setTranslationLanguages({ ...translationLanguages, from: lang })
            inputTextAreaRef.current.scrollTo(0, 0);
        }
        else {
            setTranslationLanguages({ ...translationLanguages, to: lang })
            outputTextAreaRef.current.scrollTo(0, 0);
        }
        console.log(translationLanguages);
    }

    const handleTextChange = (e) => {
        let newText = e.currentTarget.value;
        setTextInput({ ...textInput, [e.target.name]: newText });
    }

    const handleSwap = () => {
        if (translationLanguages.from.name === 'Detect Language') return;
        setTranslationLanguages({ from: translationLanguages.to, to: translationLanguages.from })
        setTextInput({ input: textInput.output, output: textInput.input })
    }

    const detectLanguageCode = async () => {
        try {
            let respond = await fetch(`https://libretranslate.de/detect`, {
                method: "POST",
                body: JSON.stringify({
                    q: textInput.input
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());
            if (respond.error) throw new Error(respond.error);
            setTranslationLanguages(preLanguages => {
                return { ...preLanguages, from: { name: preLanguages.from.name, code: respond[0].language } }
            });
        } catch (e) {
            toast.error('Unable to detect language');
        }
    }

    const handleTranslate = async () => {
        if (isTranslating) return;

        if (textInput.input.trim() === '') {
            toast.info('Please enter text to translate.');
            return;
        }

        setTranslating(true);
        setTextInput({ ...textInput, output: '' });
        let detectLanguage = translationLanguages.from.code === 'detect';
        if (detectLanguage) {
            await detectLanguageCode();
        }

        try {
            let respond = await fetch(`https://libretranslate.de/translate`, {
                method: "POST",
                body: JSON.stringify({
                    q: textInput.input,
                    source: translationLanguages.from.code,
                    target: translationLanguages.to.code
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res => res.json());
            if (respond.error) throw new Error(respond.error);
            setTextInput({ ...textInput, output: respond.translatedText });
            console.log(respond);
        } catch (e) {
            toast.error('Error translating text. Please try again.');
        } finally {
            setTranslating(false);
        }
    }

    const toggleList = (isInputList) => {
        setShowLanguageList({ ...showLanguageList, [isInputList ? 'input' : 'output']: !showLanguageList[isInputList ? 'input' : 'output'] });
    }

    const copyText = () => {
        navigator.clipboard.writeText(textInput.output);
    }

    const pasteText = () => {
        navigator.clipboard.readText().then(text => {
            if (text.length > INPUT_CHARACTER_LIMIT) {
                const adjustedText = text.slice(0, INPUT_CHARACTER_LIMIT);
                setTextInput({ ...textInput, input: adjustedText });
            }
        });
    }

    useEffect(() => {
        // Fetching supported translationLanguages list
        async function fetchLanguages() {
            try {
                let translationLanguages = await fetch('https://libretranslate.com/languages')
                    .then(res => res.json())
                setAvailableLanguagesList(translationLanguages);
            } catch (e) {
                toast.error('Error fetching supported languages list');
            }
        }
        fetchLanguages();
    }, []);

    return (
        <div className='Translate'>
            <ToastContainer
                position="top-center"
                hideProgressBar
                newestOnTop={true}
                autoClose={3000}
                pauseOnFocusLoss
                pauseOnHover
                theme="dark"
            />
            <img src={logo} alt="" className='logo' />
            <main className='TranslationCards'>
                <TranslationCard
                    languageName={translationLanguages.from.name}
                    languageList={availableLanguagesList}
                    isInput={true}
                    showLanguageList={showLanguageList.input}
                    handleTextChange={handleTextChange}
                    handleLanguageChange={handleLanguageChange}
                    handleSwap={handleSwap}
                    textValue={textInput.input}
                    toggleList={() => toggleList(true)}
                    copyText={copyText}
                    pasteText={pasteText}
                    handleTranslate={handleTranslate}
                    inputTextAreaRef={inputTextAreaRef}
                    outputTextAreaRef={outputTextAreaRef}
                    INPUT_CHARACTER_LIMIT={INPUT_CHARACTER_LIMIT}
                    isTranslating={isTranslating}
                />
                {/* Output Section */}
                <TranslationCard
                    languageName={translationLanguages.to.name}
                    languageList={availableLanguagesList}
                    isInput={false}
                    showLanguageList={showLanguageList.output}
                    handleTextChange={handleTextChange}
                    handleLanguageChange={handleLanguageChange}
                    handleSwap={handleSwap}
                    textValue={textInput.output}
                    toggleList={() => toggleList(false)}
                    copyText={copyText}
                    pasteText={pasteText}
                    handleTranslate={handleTranslate}
                    inputTextAreaRef={inputTextAreaRef}
                    outputTextAreaRef={outputTextAreaRef}
                    INPUT_CHARACTER_LIMIT={INPUT_CHARACTER_LIMIT}
                    isTranslating={isTranslating}
                />
            </main>
        </div >
    )
}

export default Translate