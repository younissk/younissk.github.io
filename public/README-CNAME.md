# Turning the custom domain on

`CNAME.disabled` holds `youniss.dev`. It is **not** active.

GitHub Pages reads a file called exactly `CNAME` from the published folder. The
moment that file exists, Pages redirects `younissk.github.io` to the domain
inside it. If DNS is not pointing at GitHub yet, that redirect sends every
visitor somewhere else — or nowhere.

So the order is: **DNS first, file second.**

1. At the registrar, point the apex `youniss.dev` at GitHub Pages:

   A     185.199.108.153
   A     185.199.109.153
   A     185.199.110.153
   A     185.199.111.153
   AAAA  2606:50c0:8000::153
   AAAA  2606:50c0:8001::153
   AAAA  2606:50c0:8002::153
   AAAA  2606:50c0:8003::153

   and `www` as a CNAME to `younissk.github.io`.

2. Wait for it to resolve (`dig +short youniss.dev` should show those A records,
   not the Netlify addresses).

3. Then:

   git mv public/CNAME.disabled public/CNAME
   npm run build
   git commit -am "chore: enable custom domain" && git push

4. Repo Settings, Pages, tick **Enforce HTTPS** once the certificate issues.

To go back to the free `younissk.github.io` address at any point, rename the
file away again and rebuild. Nothing else in the site depends on the domain.
