<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the wall experience in a shared client component rendered by both `/` and `/wall`; this makes the requested first screen and the canonical wall path behave identically.
- Keep creation URLs in the `u` query parameter and decode each URL individually; this preserves shared wall links without a backend.
- Use the official Telegram link observed on the existing live site (`https://t.me/apiringbot`) for wall calls to action; this avoids inventing a bot destination.
