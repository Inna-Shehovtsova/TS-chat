export const smileCollection = [
  { symb: ":-)", html: "&#128512;" },
  { symb: "=)", html: "&#128512;" },
  { symb: ":-D", html: "&#128515;" },
  { symb: ":-(", html: "&#128545;" },
  { symb: "*O*", html: "&#128525;" },
  { symb: "XD", html: "&#128518;" },
  { symb: ":-|", html: "&#129300;" },
  { symb: ":-/", html: "&#128533;" },
  { symb: ":O", html: "&#128565;" },
];

export function smileInText(text: string) {
  let stext = text;
  for (const k of smileCollection) {
    stext = stext.replace(k.symb, k.html);
  }
  return stext;
}
