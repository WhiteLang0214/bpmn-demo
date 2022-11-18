import translations from './translations-zh_cn';


export default function customTranslate(template, replacements) {
    replacements = replacements || {};
    // Translate
    const template_trans = translations[template] || template;
    // console.info(template, ' ---> ', template_trans)

    // Replace
    return template_trans.replace(/{([^}]+)}/g, function(_, key) {
        var str = replacements[key];
        if (translations[replacements[key]] != null && translations[replacements[key]] != 'undefined') {
            str = translations[replacements[key]];
        }
        return  str || '{' + key + '}';
    });
}