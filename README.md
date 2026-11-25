# Demos

Collection of interactive prototypes and explorations.

## Live Demos

🚀 **[View all demos](https://demos.mrleemurray.com)**

- [Collections](https://demos.mrleemurray.com/spaces/) - Slack-inspired contexts for Editor and Agents work areas
- [Agent Merge Lab](https://demos.mrleemurray.com/agent-merge/) - Standalone workbench for Agent Merge UX exploration
- [Chat Input Prototype](https://demos.mrleemurray.com/chat-input-prototype/) - VSCode-inspired chat interface
- [Gutter Tab](https://demos.mrleemurray.com/gutter-tab/) - Gutter tab behaviors exploration
- [Hat Stacker](https://demos.mrleemurray.com/hat-stacker/) - Catch and balance falling hats with the VS Code pet
- [Provider Info](https://demos.mrleemurray.com/provider-info/) - Rotating provider quality labels

## Projects

### Collections

A workstream often spans repositories, Agent sessions, and Editors. Keeping every task in one mixed session tree makes it difficult to return to the right context. **Collections** group related projects and work areas at a level above session groups; they do not replace session grouping or profiles. Session groups organize conversations within Agents; profiles configure the editor. Collections group ongoing work without adding account/settings isolation or requiring a separate window per context.

Choose **Start in Agents** or **Start in Editor** when creating a Collection, then open associated work areas as needed. The type picker marks the selected option with a right-aligned checkmark and retains standard radio-group keyboard navigation. A **dropdown in the left of the title bar** provides navigation without adding another sidebar. Editor work areas retain their Activity Bar, Explorer, tabs, and terminal, while Agents work areas retain their Sessions sidebar and chat.

Use **Prototype settings** above the workbench to compare **Switcher position → Left title bar** with **Command center**, and **Window layout → Single work area** with **Floating windows**. The command-center version integrates the same Collection dropdown beside the current project/folder and branch; Editor keeps its chat controls. Both switcher positions retain the same navigation, attention badges, menus, and appearance editing. The command center uses the same responsive width in Editor and Agents. Settings apply immediately and are remembered in this browser under `vscode-collections-prototype-settings-v1`, separately from saved Collections. Older settings retain Single work area until Floating windows is chosen.

**Feature tour** in the app header starts with the workstream problem, then explains the Collection → projects/work areas → session groups/sessions hierarchy and distinction from profiles. Further spotlights cover session assignment/movement, optional window actions, and session-to-Editor handoff. Each step automatically opens its relevant picker, menu, or work area; there are no separate “Show…” buttons. Next/Back revisits the UI for all five steps, ending with **From session to Editor**. The tour can reopen saved windows on an empty desktop, but does not create Editors, load examples, create sessions, or discard drafts. Missing session features explain what is needed rather than opening setup dialogs. Finish, the close button, or Escape ends the tour, dismisses its menus, and restores focus to the launch button. Spotlights follow actual controls as windows move or menus change, and keep the underlying UI interactive. Native dialogs temporarily pause the tour; closing them reveals the current step again. The tour can be restarted at any time and supports high contrast and reduced motion.

**Work-area switching animation** and **Collection switching animation** independently offer **Fade and slide**, **None**, and **Zoom focus**. Switching work areas within a Collection uses the work-area choice; switching Collections uses the Collection choice, including when their work-area types differ. Collection **Fade and slide** crossfades both views with a 48px horizontal slide over 260ms, following the order of Collections: forward enters from the right, backward from the left. Work-area **Fade and slide** retains its subtle 4px vertical arrival over 150ms. Zoom focus crossfades outgoing and incoming views over 220ms with a small scale change and defocus/refocus blur; the title bar stays fixed. Outgoing content is inert and hidden from assistive technology while the incoming view receives keyboard focus. The transition is clipped to the work-area viewport so it does not introduce scrollbars. Browser/OS reduced-motion preferences disable motion without changing either saved choice. Animation preferences use the same separate prototype-settings record. Older records initialize the Collection animation from their existing switching animation; records without an animation choice default to Fade and slide.

Both animation choices also apply inside floating windows. Only the switched window's content animates; its title bar, frame, geometry, and other desktop windows stay in place. Focusing an already-open work area does not replay a switching animation. Collection direction, reduced motion, theme-color interpolation, and the independent None choices are preserved.

The floating desktop has its own fixed dark shell and blue-slate wallpaper with a subtle dot grid. Switching Collections or previewing/saving window themes never changes the desktop or header palette. Windows and Collection menus keep their own theme colors. Window-opened dialogs match their originating window's palette, even when operating on a different browsed Collection; Prototype settings stays with the desktop palette. Forced-colors mode replaces the wallpaper with a solid system-color surface.

The concept is named **Collections** to distinguish it from GitHub Codespaces. The existing `/spaces/` demo URL, internal identifiers, and storage format remain unchanged, so previously saved Collections and work areas continue to load.

The built-in projects have different content so Collection switches are easy to recognize: **vscode** has command-palette TypeScript/CSS and workbench watch output; **field-notes** has Markdown journals, garden notes, and publishing output; **storefront** has a React collection grid, product data, a product-card response preview, and Vite output. Explorer folders, tabs, syntax, language indicators, changed files, and terminal content follow the project. These are local fixtures, not running builds or a live storefront. Saved Collections, appearance, and drafts are not reset. Legacy shared-placeholder tabs display the project's primary file without rewriting saved context; new file selections persist normally.

**Prototype settings → Load example projects** optionally adds **weather-station** (Python observations/forecasts), **task-api** (Go HTTP service), and **release-notes** (Markdown announcements) to the selected Collection. Each has one Editor and one Agents work area, a project folder, two linked worktree locations, and sessions tied to those locations. Linked examples show different source content for their branch. Loading preserves existing saved work and open-window state, does not navigate or open windows, and skips projects already present in that Collection. Open an example explicitly through the Collection picker.

**Load workstream examples** adds two optional Collections: **VS Code experience** (`vscode` and `vscode-docs`) and **Markdown tooling** (`vscode-markdown` and `markdown-language-service`). Each repository has an Editor and Agents work area with distinct tasks and session worktrees. These illustrate related work across repositories rather than only Work/Personal separation. Existing Collections, active projects, and open windows stay unchanged; repeated loading skips Collection names already present.

New Agents sessions use the project and Collection of their current work area; the composer has no Collection/project controls. Creating a session keeps it in that work area without switching Collections or adding a desktop window. Right-click a session row for **Move session…** alongside its Editor opening actions; the session header contains only its title and status. Moving transfers only that session and its associated Editor work areas, preserves the checkout path, IDs, files, drafts, and other sessions, and does not open or close windows. Existing destination sessions keep their selection; another Collection's open windows remain independently usable. Move dialogs use the source frame and theme; Cancel returns focus to the originating row and leaves data unchanged.

The checkmark on a session row **marks it as done** and removes it from the active list and session counts. It appears on hover or keyboard focus, stays visible on the selected row, and is always visible on touch devices. Completed sessions remain saved with their worktrees and linked Editors; marking done does not delete or close them. Completing an unselected session leaves the current conversation alone. Completing the selected session shows another active session, or the new-session composer when none remain, while preserving the draft. Completion persists across reloads and synchronized windows.

The built-in **2026 Dark** and **2026 Light** choices use the official VS Code theme definitions, including inherited defaults, via `--vscode-*` color tokens. Menus, inputs, buttons, list selections, attention badges, Agents panels/chat input, and sample syntax use their corresponding theme roles rather than a custom approximation. Theme palette colors interpolate over 220ms during Collection switches and live theme previews, including newly mounted views; this does not add delays to hover states or replace the work-area zoom transition. Reduced-motion preferences disable the color fade. Collection avatar accents derive from the theme's chart colors; their tinted backgrounds are specific to this concept. macOS traffic lights retain their platform colors. This is a bundled palette snapshot, not a connection to the host editor's active theme.

The Editor shell follows the current Insiders **Modern UI** composition: a connected Activity Bar/Explorer card, separately framed editor and terminal panels, 4px gutters, 8px corners, connected editor tabs, and title-case pane headers. The 35px title bar uses separate left, center, and right regions: Collections stays beside the macOS controls, navigation accompanies the compact command center, and Editor layout controls sit on the right. The Collection switcher matches the command center's height (24px in Editor, 22px in Agents), regular-weight label, and inset focus outline used by title-bar buttons. Agents also places its sidebar toggle on the right, beside Accounts, while retaining its workspace/branch field. Theme surfaces follow the local VS Code 2026 palettes. Files, syntax rendering, terminal output, and title-bar controls other than Collections and the primary sidebar toggle remain illustrative, not a live Monaco editor or shell.

The Terminal panel uses the connected pane-tab treatment: its active first tab meets the panel's left edge and connects to the content surface through a curved shoulder. Output and Problems remain on the tab strip, without an inset boxed active-tab appearance.

The **Agents** view follows the product's Sessions layout: a 32px header with compact New and Find Session actions, 54px session rows, a Customizations section, and a narrow session-tools strip. Its title bar shares the Agents shell background, including in floating windows; Editor keeps its own title-bar surface. Header, conversation, and composer share a 950px centered content band; the conversation and composer have 24px insets on desktop. The conversation uses understated request bubbles and no redundant author banner, while the composer follows the product's context/mode/model/submit arrangement. Find Session reveals inline search; Escape clears it and returns focus. The floating chat card is retained rather than copying the inspected window's user-selected compact density. Automations, Customizations destinations, tool-strip destinations, and composer pickers remain visual placeholders; creating previews and opening sessions in Editor still work locally. Prototype disclaimers are kept in this documentation rather than inline notes or tooltips. New preview sessions show the submitted request without generating a Copilot response; no AI request is sent.

Open the **Collection dropdown** to see a left-hand **Collections navigation list**, including **Create a collection** and management actions. It uses VS Code's themed menu surfaces, compact rows, sentence-case group headings, separators, and inset keyboard-focus outlines. Choose a Collection to reveal its work areas on the right, or choose **New work area**. Standalone Editor rows show their project and branch, with a linked-worktree name inline only when applicable. Session Editors show the project and their session title once, omitting repetitive worktree names and generated branch identifiers. Agents rows show session counts without worktree totals; individual sessions still identify linked worktrees with their worktree icon. Work-area rows do not show hover or focus tooltips; full project names and types remain in their accessible labels. Action buttons retain their short descriptive tooltips. The ordinary project folder is never counted or labeled as a worktree. Selecting a work area focuses it and closes the dropdown; right-click or press **Shift+F10** for Close and Move. The Sessions/Explorer toggle is unchanged.

Standalone Editor work areas default to the project folder and current branch. During creation, **Branch or worktree** groups available branches and linked checkouts separately. Choosing a branch switches the shared project folder on submission, updating the branch shown by every work area using that folder, including in other Collections. Existing linked worktrees and their Editors keep their own branches. Choosing a worktree opens its exact checkout without changing the project folder. Branch choices come from saved checkout metadata and the example projects; selection and cancellation never change a checkout. Every Agents session automatically gets its own linked worktree, including new preview tasks on otherwise ordinary projects. New sessions use distinct branch/path identities even when their task titles match. There is no session checkout selector; the worktree icon identifies each session's location. **Open in Editor** uses that session's exact folder. The stored checkout metadata distinguishes `kind: 'project'` from `kind: 'worktree'`, independently of branch names. Branch switching and worktree creation are simulated locally; no Git or filesystem operation is performed.

Editor breadcrumbs show the checkout path as read-only context, without a folder-location or worktree switcher. Linked checkouts are identified as **Worktree: name** in the command center with the worktree icon; ordinary project folders do not show this label. The terminal shows the same path and branch, and linked examples retain their checkout-specific source content. Choose an existing worktree when creating an Editor work area, or use Open in Editor to create one on an Agents session's exact checkout. Existing sessions and saved Editor contexts are not reassigned by browsing.

In the Sessions list, linked-worktree sessions use the **worktree codicon** in their secondary metadata line instead of the local desktop icon. The leading session-status icon remains unchanged.

The Collection list starts directly with its items, without a redundant heading. Selected Collections and work areas use the workbench's inactive-list selection colors, with list-hover colors for hover and the themed inset outline for keyboard focus. Selection uses row highlighting without checkmarks; selection state remains available to assistive technology. Work-area rows lead with the project name rather than an Editor/Agents text label, retaining the type icon and accessible type description. Leading icons align with the project name. Attention badges sit directly beside it, with branch or session details underneath.

The **edit pencil beside the Collection heading** updates its **title and description directly in the dropdown**. Save persists the changes without closing the dropdown; Cancel or Escape discards the draft. Titles must be nonempty and unique. From the work area list, **Home** focuses the edit control.

Create a collection and Manage collections share the compact VS Code dialog treatment with New work area: 14px semibold titles, 28px inputs/action buttons, inset focus outlines, and a plain dimmed backdrop. In Create a collection, the Start in options appear side by side, with Agents first and Editor second. Management retains its Collection list and all metadata/appearance controls, without promotional headings or oversized card selectors.

In Floating windows layout, work-area and Collection dialogs stay centered inside the window that opened them. Their backdrop and inert content are limited to that frame; other windows and the desktop remain usable. Keyboard focus wraps within the dialog, and Cancel, Escape, or clicking its local backdrop restores the source control. Small windows keep dialogs bounded and scroll their content. Collection creation does not preview the new Collection's theme on the source window. Prototype settings and dialogs opened without a source window retain page-level modality.

Each work-area row has an ellipsis **Work area actions** menu, also available by right-click or Shift+F10. The menu contains actions only, without a project-details header. **Delete work area…** asks for confirmation before removing the saved work area, its sessions, draft, and settings; it works whether its desktop window is open or closed. Files and the Collection itself are not deleted. An open window displaying the deleted area is removed, while other windows remain unchanged. Floating work-area menus omit **Close window**; the title-bar close button still closes the physical window and retains the work area's saved data.

The same editor also supports a **Collection image**, **Collection color**, and **Color theme** dropdown. Upload PNG, JPEG, or WebP images up to 2 MB; they are center-cropped to a 128 × 128 PNG and stored only in this browser. Remove restores the Collection's initial. The dropdown currently offers the prototype's supported themes, **2026 Dark** and **2026 Light**. Theme changes preview immediately in the current window. Save keeps the theme for all Editor and Agents work areas in that Collection; Cancel or dismissing the editor restores the saved theme. Other windows receive only saved changes. Appearance is also available when creating or managing a Collection, persists across reloads, and remains independent between Collections.

Adding a work area uses a compact VS Code-style dialog. Choose **Editor** or **Agents**, then choose **Current window** or **New window** in the **Open in** radio group, styled like the type selection with a checkmark on the selected row. Arrow keys change the choice. Current window replaces content in the originating frame while preserving its geometry and the previous work area's saved data. New window leaves the source open and adds a separate desktop frame; choosing it from Single layout activates Floating windows and retains the original work area. The initial choice preserves existing behavior: Current window in Single layout, New window in Floating layout. Without an originating desktop window, Current window is disabled. Editor requires a choice from a **project or folder dropdown**, populated across Collections without duplicates. **Branch or worktree** is offered after selecting a project and defaults to its current project-folder branch, with separate **Branches** and **Worktrees** groups. **Other project or folder…** reveals an input for a new name or path; whitespace-only values are rejected and trimmed. Agents reuses the browsed Collection's project/folder, or its name when none is open. Cancelling discards the draft and opening choice. This is prototype context, not a filesystem picker or actual folder-opening operation.

Work area badges in the dropdown count **sessions needing input**, including **Needs review**. Each session counts once, regardless of how many requests it has. Working, completed, and preview sessions do not contribute, and no badge is shown at zero. Accessible descriptions explain the count.

A Slack-style dot on the **Collection switcher** indicates sessions needing input in **other Collections**, not the current Collection. Matching dots in the dropdown identify those Collections; their accessible descriptions give the pending-session counts. The indicator updates as requests are resolved or you switch Collections.

The Collection switcher has no hover popup. Open its dropdown for work-area details and attention counts; the notification dot retains its screen-reader description.

Clicking a Collection, or activating it with Enter or Space, updates the right-hand list without changing the current project, theme, open windows, or saved navigation state. Hovering or moving keyboard focus does not change the browsed Collection. Select a work-area row to switch; the Collection chooser itself is browse-only. Use **Up/Down** within a list, **Right** to move to the browsed Collection's current or last-used work area, **Left** to return, and **Enter** to select. In the open chooser, **Ctrl+Alt+1–9** browses Collections; outside it, those shortcuts retain direct Collection switching. **Escape** dismisses browsing and restores focus to the originating title-bar button. Reopening starts with that window's actual Collection. Closing the final work area leaves the Collection available for opening another work area.

Collection and work-area changes use their independently selected animations. Focusing a floating window raises it without replacing the desktop or remounting other work areas. The dropdown has a fixed 320px height, capped by the available viewport space. **Create a collection** and **Manage collections…** stay pinned at the bottom of the left pane. In the right pane, the Collection heading and **New work area** action stay visible; only the work-area list scrolls, with a thin themed scrollbar and a stable gutter so rows do not shift when scrolling is needed. The Collection list remains independently scrollable by wheel or keyboard without a visible scrollbar. Appearance editing scrolls within the right pane when needed. The work-area pane updates instantly when activating a Collection, without fading, sliding, or resizing. Menu tooltips render outside the scrolling surface and are clamped to the viewport; they cannot create scrollbars or change row widths. The title bar and Collection list stay in place; outgoing content is inert during exit animations. Motion is disabled when the system's reduced-motion preference is enabled.

In Floating windows layout, selecting a work-area row changes that window's content in place, preserving its identity, position, size, and maximized state. Browsing another Collection never replaces content or focuses its windows. Other work-area rows have an always-visible trailing action: **Open in new window** opens a closed work area in another desktop window without replacing the source; **Focus window** raises its existing window and restores it if minimized, never creating a duplicate. These actions can be used directly from a browsed Collection without first changing the source project. The current window has no redundant focus action in its row or context menu. The icons, tooltips, accessible labels, and context-menu action reflect that open state without a visible Closed label. Creation, moving, closing, and appearance editing also target the browsed Collection; opening or cancelling a contextual dialog does not navigate away from the source project. There is no global Collection picker in the desktop header. On an empty desktop, **Open VS Code** explicitly reopens the last-used work area, including its saved geometry and content. Its identity is retained separately from the open-window list, so an empty desktop still stays empty on reload. If the remembered area was deleted or an older layout has no history, the selected Collection's last-used area is tried, then the first available saved area. With no saved areas, the button opens the chooser so a new one can be created. Windows from different Collections can stay open together, retaining their own Collection themes, sessions, files, and drafts. Work areas not displayed in a window stay in the chooser, and their saved content is retained when switching away. In Single work area layout, **Open in new window** activates the desktop and explicitly opens the requested work area.

Floating windows sit directly on a page-level desktop, not inside a parent VS Code window. Each has its own VS Code title bar, command center, Collection control, and working minimize/maximize/close buttons. There is no desktop bottom bar. Collection menus open above windows without being clipped and stay open while changing Collections. Drag a blank title-bar area to move a window; drag the unmarked lower-right corner to resize it. Double-clicking a blank title-bar area maximizes/restores it. With the title-bar move control focused, arrow keys move the window, Shift+arrow keys resize it, and Enter maximizes/restores it. Use **Focus window** in a Collection picker to restore a minimized window; when all windows are minimized, the desktop's **Restore window** button restores one. Closing a desktop window retains its saved work area for explicit reopening; minimizing keeps it in the persisted open-window list. The open-window list, stable frame identities, focused window, geometry, and minimized/maximized states use version 3 of `vscode-collections-floating-layout-v1`. Version 2 records retain exactly their saved open windows and geometry when upgraded. Earlier geometry-only records are backed up under `vscode-collections-floating-layout-v1-before-explicit-windows`, and currently visible windows are retained during migration. Reload restores only the saved open-window list, including an empty desktop, with each window's last selected content. Legacy `?popout=` and `?dock=` links explicitly open the requested work area without creating another browser window.

Opening, restoring, or switching a desktop window focuses its frame rather than the blank title-bar move control. Tab to the move control to use its keyboard shortcuts; keyboard focus indicators remain visible.

New windows cascade 40px across and 28px down from the focused window, wrapping to an available position near desktop edges. Reopened saved positions are retained unless they align with a visible window; saved maximized windows reopen at their restore size when other windows are visible. Existing visible windows are never repositioned, and in-place work-area switches retain their frame geometry.

All windows share locally persisted Collection data while keeping independent sessions, drafts, open files, and sidebar preferences. The existing serialized, ID-based data merging still supports separately opened tabs. The demo no longer creates native browser pop-outs, requires pop-up permission, or uses per-work-area browser-host leases.

Right-click any session row, or focus it and press Shift+F10 or the Context Menu key, for **Open in Editor** (here), **Open in Editor in new window**, and **Move session…**. These actions live only in the session item context menu, not the conversation header. The menu targets that row without changing the selected conversation. Editor opening uses the session's exact checkout, not the Agents area's default branch. Each session owns its own Editor; reuse requires the same source/session association, project, and checkout path. Two sessions never share that Editor. Reopening preserves its draft, selected file, and sidebar state. Different projects or checkout folders are not retargeted. If the matching work area is already open, its window is restored/focused rather than duplicated, regardless of the chosen destination.

For a closed matching Editor, or when a new work area is needed, **Open in Editor** replaces content in the originating window while retaining the saved Agents area, session, and draft. Its floating frame identity and geometry are preserved. **Open in Editor in new window** opens a separate desktop frame and leaves the Agents window open; from Single layout it explicitly activates Floating windows. Repeated handoffs from the same session reuse its saved Editor. Up/Down and Home/End navigate enabled actions; Enter/Space selects, and Escape closes the menu and restores row focus. Move session is disabled when there is no other Collection. The menu floats outside the chat card, inherits the Collection's theme, and stays within the viewport. Opened or focused Editors receive file-tab focus.

Create, rename, recolor, and remove Collections, and preview sessions. State is saved in browser local storage. Work areas, files, sessions, and activity are simulated: no real VS Code instance, worktree, agent, account isolation, or filesystem access is involved.

Saved data uses schema version **5**, requiring a distinct linked worktree for every Agents session. Version 4 is backed up under `vscode-spaces-exploration-v1-before-session-worktrees` before local or shared session folders are converted. Unique existing linked checkouts keep their identities; associated session Editors follow migrated folders while retaining IDs, drafts, files, and UI state. Standalone project-folder Editors are not converted. The explicit open-window list and geometry are unchanged, including an empty desktop. Version 3 retains its separate `vscode-spaces-exploration-v1-before-worktrees` backup; older single-area/multi-area data uses `vscode-spaces-exploration-v1-before-window-management`. Backups are not overwritten. Checkout entities merge independently across windows, and moving an Agents work area remaps its session checkout references. Persisted `spaces`/`windows` fields and storage keys retain their original names.

**Tech:** Vue 3, Vite, Vitest, VS Code Codicons

```bash
cd spaces
npm install
npm run dev
npm test
npm run build
```

Use **Ctrl+Alt+1–9** (**Control+Option+1–9** on macOS) to switch collections, or browse them while the chooser is open. The shortcuts use the physical number keys, so Option-generated characters do not interfere. Use arrow keys in the switcher, **Escape** to dismiss menus/dialogs, and **Alt+F1** for concept and keyboard help.

### agent-merge

Standalone Agent Merge UX lab with mocked pull request scenarios, per-session controls, and an Agents Window shell.

**Tech:** Vue 3, Vite, Vitest, VS Code Codicons

```bash
cd agent-merge
npm install
npm run dev
```

### chat-input-prototype

VSCode-inspired chat interface with token tracking, animation controls, and message history.

**Tech:** Vue 3, Vite, VSCode Codicons

```bash
cd chat-input-prototype
npm install
npm run dev
```

### gutter-tab

Explorations for gutter tab behaviors and interactions.

**Tech:** Vue 3, Vite

```bash
cd gutter-tab
npm install
npm run dev
```

### provider-info

AI provider icons that reveal a rotating ring of descriptive qualities on hover, focus, or activation.

**Tech:** Vue 3, Vite, VSCode Codicons

```bash
cd provider-info
npm install
npm run dev
```

### hat-stacker

Canvas mini game starring the VS Code pet. Catch every falling hat while counter-steering an increasingly tall and unstable stack.

**Tech:** Vanilla JavaScript, Canvas, Vite, Vitest

```bash
cd hat-stacker
npm install
npm run dev
```

## Deployment

All demos are automatically deployed to `demos.mrleemurray.com` via GitHub Actions when changes are pushed to the `main` branch.

- Push to `main` → Automatic deployment
- Each project is deployed to its own path (e.g., `/chat-input-prototype/`, `/gutter-tab/`)
- The root path serves an index page listing all available demos

### Manual deployment

```bash
# Trigger workflow manually from GitHub Actions tab
# Or push to main branch
git push origin main
```

## Adding a New Demo

1. Create your project folder in the root directory
2. Configure `vite.config.js` with `base: '/your-project-name/'`
3. Add build steps to `.github/workflows/deploy-demos.yml`
4. Update the root index.html card list (auto-generated during deployment)
