export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy('src/_redirects');
  eleventyConfig.addCollection('projects', api => api.getFilteredByTag('project').sort((a, b) => a.data.order - b.data.order));
  return { dir: { input: 'src', output: '_site' }, templateFormats: ['njk'], htmlTemplateEngine: 'njk' };
}
