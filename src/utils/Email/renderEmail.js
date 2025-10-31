const path = require("path");
const { render } = require("@react-email/render");
require("@babel/register")({
  extensions : [".js", ".jsx"],
  presets : ["@babel/preset-env", "@babel/preset-react"],
});

/**
 * Render template email berbasis JSX
 * @param {string} templateName - nama file template tanpa ekstensi (misalnya 'WelcomeEmail')
 * @param {object} props - data yang akan dikirim ke komponen email
 * @returns {string} hasil HTML dari komponen
 */

async function renderEmail(templateName, props = {}) {
  const templatePath = path.join(__dirname, "templates", `${templateName}.jsx`);
  const template = require(templatePath);
  const Component = template.default || template;
  const html = await render(Component(props));
  return html;
}

module.exports = renderEmail;