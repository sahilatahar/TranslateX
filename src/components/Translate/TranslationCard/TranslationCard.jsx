import PropTypes from 'prop-types';
import copyIcon from '../../../assets/copy.svg';
import arrowDownIcon from '../../../assets/expand_down.svg';
import swapIcon from '../../../assets/horizontal_top_left_main.svg';
import translateIcon from '../../../assets/sort_alfa.svg';
import './TranslationCard.scss';

const TranslationCard = ({
    languageName,
    languageList,
    isInput,
    showLanguageList,
    handleTextChange,
    handleLanguageChange,
    handleSwap,
    textValue,
    toggleList,
    copyText,
    pasteText,
    handleTranslate,
    inputTextAreaRef,
    outputTextAreaRef,
    INPUT_CHARACTER_LIMIT,
    isTranslating
}) => {
    return (
        <section className="Card">
            <header className="Card__header">
                <span>{languageName}</span>
                <span className='down__arrow' onClick={toggleList}>
                    <img src={arrowDownIcon} alt="" />
                    {showLanguageList && <div className="language__list" ref={inputTextAreaRef}>
                        {isInput && <span onClick={() => handleLanguageChange({ isInput: isInput, lang: { code: 'detect', name: 'Detect Language' } })}>Detect Language</span>}
                        {languageList.map((language, index) => (
                            <span key={index} onClick={() => handleLanguageChange({ isInput: isInput, lang: language })}>{language.name}</span>
                        ))}
                    </div>}
                </span>
                {!isInput &&
                    <div href="#" className="icon-bordered align-right" onClick={handleSwap}>
                        <img src={swapIcon} alt="swap icon" />
                    </div>
                }
            </header>
            <textarea
                name={isInput ? 'input' : 'output'}
                onChange={handleTextChange}
                value={textValue}
                placeholder={isInput ? 'Type something here ...' : ''}
                maxLength={INPUT_CHARACTER_LIMIT}
                ref={isInput ? inputTextAreaRef : outputTextAreaRef}
            ></textarea>
            {isInput && <div className="char-count">{textValue?.length}/{INPUT_CHARACTER_LIMIT}</div>}
            <footer className="Card__footer">
                <span href="#" className="icon-bordered" onClick={isInput ? pasteText : copyText}>
                    <img src={copyIcon} alt="copy icon" />
                </span>
                {isInput && <button onClick={handleTranslate}>
                    <img src={translateIcon} alt="" /> {isTranslating ? 'Translating...' : 'Translate'}</button>}
            </footer>
        </section>
    );
};

TranslationCard.propTypes = {
    languageName: PropTypes.string.isRequired,
    languageList: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            code: PropTypes.string.isRequired
        })
    ).isRequired,
    isInput: PropTypes.bool.isRequired,
    showLanguageList: PropTypes.bool.isRequired,
    handleTextChange: PropTypes.func.isRequired,
    handleLanguageChange: PropTypes.func.isRequired,
    handleSwap: PropTypes.func.isRequired,
    textValue: PropTypes.string.isRequired,
    toggleList: PropTypes.func.isRequired,
    copyText: PropTypes.func.isRequired,
    pasteText: PropTypes.func.isRequired,
    handleTranslate: PropTypes.func.isRequired,
    inputTextAreaRef: PropTypes.object.isRequired,
    outputTextAreaRef: PropTypes.object.isRequired,
    INPUT_CHARACTER_LIMIT: PropTypes.number.isRequired,
    isTranslating: PropTypes.bool.isRequired
};

export default TranslationCard;