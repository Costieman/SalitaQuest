# Canonical Avatar Rebuild and Stable Release Checklist

This checklist governs the avatar rebuild that starts from frozen baseline commit `b9490dfd6fda901fb1acada1719e843d1d95e67c` on branch `fix/avatar-canonical-assets`.

The target is not another hotfix. The target is one stable, testable avatar pipeline with no active runtime redundancy.

## Working rules

- Complete one bounded task at a time.
- Each task must produce a visible result: commit, file, validation report, screenshot, or documented blocker.
- Stop when a task reaches ten minutes without safe completion; divide it before continuing.
- Do not modify `main` until the candidate release passes all required gates.
- Do not change learner progress, ownership, shard, reward, or equipped-avatar semantics during artwork work.
- Do not change the service worker until ordinary online browser integration passes.
- Do not introduce temporary binary-transfer mechanisms, runtime image generation, or another avatar repair layer.

## 1. Source artwork gate

All boxes must pass before application integration begins.

- [ ] The supplied archive is the declared artwork source of truth.
- [ ] Exactly 48 intended avatar PNG files are present.
- [ ] Every source file can be decoded successfully.
- [ ] Every source file has transparency where expected.
- [ ] Every source file has a recorded SHA-256 hash.
- [ ] No two intended avatars share the same file hash.
- [ ] No unintended placeholder, contact sheet, thumbnail, or duplicate file is included.
- [ ] The revised Luzon Bleeding-Heart Dove is used instead of the earlier draft.
- [ ] All eye and silhouette corrections approved by the user are represented in the source set.

**Failure rule:** Any missing, unreadable, duplicated, or uncertain source file stops the rebuild before repository upload.

## 2. Stable identity gate

The existing 48 avatar identities are the persistence contract.

- [ ] Exactly 48 canonical stable IDs are defined.
- [ ] Every stable ID maps to exactly one display name.
- [ ] Every stable ID maps to exactly one canonical PNG filename.
- [ ] Every canonical filename is unique.
- [ ] Every manifest file reference exists.
- [ ] Existing saved IDs retain the same avatar identity.
- [ ] Historical aliases normalize to canonical IDs.
- [ ] Alias support does not create a second catalogue or second resolver.
- [ ] Starter avatar identities remain unchanged.
- [ ] Rarity, shard requirements, level rewards, and unlock sources remain unchanged unless separately approved.

**Failure rule:** Any ambiguous, duplicated, renamed, or orphaned stable ID blocks integration.

## 3. Canonical asset repository gate

- [ ] Canonical files live under one directory: `avatars/canonical/`.
- [ ] All active avatar artwork files use PNG.
- [ ] Files use consistent canonical ID-based naming.
- [ ] The repository contains exactly 48 active canonical avatar PNGs.
- [ ] No active catalogue entry points to legacy PNG, WebP, SVG, wrapper, or sprite artwork.
- [ ] The 48 files render independently in a standalone gallery.
- [ ] The gallery reports zero failed image loads.
- [ ] A numbered contact sheet is generated from the committed canonical files.
- [ ] The user has reviewed the contact sheet before runtime release.

## 4. Visual artwork acceptance gate

Review all 48 avatars at both card size and enlarged size.

- [ ] Correct subject appears for every name and stable ID.
- [ ] No missing eyes or unintended transparent holes.
- [ ] No damaged or incomplete silhouette.
- [ ] No clipped head, ears, wings, antlers, tail, leaves, flowers, or object edges.
- [ ] No avatar is stretched or squashed.
- [ ] No avatar appears visibly pixelated because of CSS scaling.
- [ ] Transparent margins are reasonable and consistent.
- [ ] Locked greyscale treatment does not destroy recognition.
- [ ] Partial-colour shard states remain readable.
- [ ] The profile emblem remains readable at its smallest displayed size.
- [ ] The approved artwork appears consistently on desktop and mobile.

**Failure rule:** A visually incorrect avatar is corrected at the source-asset stage, not patched through CSS cropping or runtime transformation.

## 5. Single architecture gate

The stable release must contain one active artwork path.

- [ ] One canonical manifest owns avatar image paths.
- [ ] One canonical catalogue owns avatar definitions and progression metadata.
- [ ] One alias map handles historical ID compatibility.
- [ ] One resolver converts a stable ID into one canonical image path.
- [ ] Collection cards use the canonical resolver directly.
- [ ] Collection detail views use the canonical resolver directly.
- [ ] Equipped profile emblems use the canonical resolver directly.
- [ ] Weekly reward interfaces use the canonical resolver directly.
- [ ] Level reward interfaces use the canonical resolver directly.
- [ ] Unlock celebrations use the canonical resolver directly.
- [ ] Achievement-sharing artwork uses the canonical resolver directly.
- [ ] One bounded static fallback is used only for a genuinely unknown or missing image.

### Prohibited active mechanisms

Every item below must be absent from the active avatar runtime.

- [ ] No runtime canvas artwork conversion.
- [ ] No runtime sprite extraction or sprite-coordinate map.
- [ ] No avatar SVG wrapper that references shared artwork.
- [ ] No global `MutationObserver` that rewrites avatar image sources.
- [ ] No document-wide avatar image repair pass.
- [ ] No repeated `src` ping-pong or source retry loop.
- [ ] No raw GitHub artwork fallback.
- [ ] No multiple active artwork registries.
- [ ] No multiple active path maps.
- [ ] No version-specific avatar hotfix layered over the canonical resolver.
- [ ] No startup process that attempts to decode or verify all artwork before the collection can open.

**Failure rule:** Detection of any prohibited active mechanism fails the stable-release gate, even when the images appear correct.

## 6. Learner-data preservation gate

Test with representative existing profile data before and after the rebuild.

- [ ] Existing learner profiles remain available.
- [ ] Profile PIN state remains unchanged.
- [ ] Tagalog progress remains unchanged.
- [ ] Bisaya progress remains unchanged.
- [ ] Stable learning-item IDs and mastery history remain unchanged.
- [ ] XP remains unchanged.
- [ ] Level remains unchanged.
- [ ] Coins remain unchanged.
- [ ] Streak remains unchanged.
- [ ] Avatar ownership remains unchanged.
- [ ] Avatar shard totals remain unchanged.
- [ ] Weekly key progress remains unchanged.
- [ ] Weekly reward claims remain unchanged.
- [ ] Level milestone claims remain unchanged.
- [ ] Equipped avatar identity remains unchanged after migration.
- [ ] Unlock acknowledgement state remains unchanged.
- [ ] JSON backup/import remains compatible.
- [ ] Transfer-code migration remains compatible.
- [ ] No progress is manufactured merely by opening the rebuilt version.
- [ ] No local-storage clearing is required to install the update.

**Failure rule:** Any unexplained learner-state change blocks release.

## 7. Collection functionality gate

- [ ] Avatar Collection opens on the first attempt.
- [ ] Opening Collections does not freeze or significantly stall the browser.
- [ ] All 48 cards are rendered.
- [ ] All 48 cards load their intended artwork.
- [ ] No real avatar falls back to initials.
- [ ] Locked, partial, and owned states display correctly.
- [ ] Rarity grouping remains correct.
- [ ] Shard progress remains correct.
- [ ] Selecting a card updates the detail view correctly.
- [ ] Equip controls are available only where intended.
- [ ] Equipping an owned avatar succeeds once per action.
- [ ] Rapidly selecting several cards does not create source-rewrite loops.
- [ ] Scrolling from the first card to the final card remains responsive.
- [ ] Reopening Collections repeatedly remains responsive.

## 8. Equipped-avatar consistency gate

Test at least one starter, one common, one uncommon, one rare, and the special avatar.

- [ ] Collection card artwork matches collection detail artwork.
- [ ] Collection detail artwork matches the equipped profile emblem.
- [ ] Home profile emblem updates immediately after equipping.
- [ ] Tagalog and Bisaya show the same account-wide equipped identity.
- [ ] Navigating away and returning preserves the equipped artwork.
- [ ] Reloading preserves the equipped artwork.
- [ ] Closing and reopening the browser preserves the equipped artwork.
- [ ] A historical alias in saved data resolves to the correct canonical image.
- [ ] Unknown invalid IDs fail safely without changing ownership or equipped state.

## 9. Reward and celebration gate

- [ ] Weekly avatar reward shows the correct canonical artwork.
- [ ] Shard completion shows the correct canonical artwork.
- [ ] Level milestone reward shows the correct canonical artwork.
- [ ] Unlock celebration shows the correct canonical artwork.
- [ ] Reward acknowledgement remains once-only where intended.
- [ ] No reward is replayed because artwork loading failed.
- [ ] No reward is granted merely by opening the collection.
- [ ] Existing legitimate queued rewards remain intact.

## 10. Desktop interface gate

Test in the supported desktop browser at normal and narrow widths.

- [ ] Home loads normally.
- [ ] Main navigation remains usable.
- [ ] Collections layout remains aligned.
- [ ] Cards do not overlap.
- [ ] Images remain contained inside their intended frames.
- [ ] Detail controls remain visible.
- [ ] No unexpected horizontal scrolling.
- [ ] Browser console contains no repeated avatar errors.
- [ ] Memory and CPU use remain stable while Collections is open.
- [ ] Light theme works.
- [ ] Dark theme works.

## 11. Mobile interface gate

Test portrait mobile layout and installed/PWA-like navigation.

- [ ] Collection opens without freezing.
- [ ] All 48 cards can be reached by scrolling.
- [ ] Images are not cropped by card geometry.
- [ ] Detail view fits the viewport.
- [ ] Equip and close controls remain reachable.
- [ ] No horizontal overflow.
- [ ] Profile emblem remains correctly sized.
- [ ] Repeated opening and closing remains responsive.
- [ ] Orientation changes do not corrupt the selected avatar.
- [ ] Existing mobile lesson controls remain unaffected.

## 12. Tagalog and Bisaya parity gate

- [ ] Both language entry points load the same canonical manifest.
- [ ] Both language entry points load the same resolver.
- [ ] Both show the same 48 identities.
- [ ] Ownership and shard data are account-wide and consistent.
- [ ] Equipped identity is account-wide and consistent.
- [ ] Language-specific course progress remains separate and intact.
- [ ] No Tagalog-only artwork path exists.
- [ ] No Bisaya-only artwork path exists.

## 13. Online loading gate

Test before any service-worker change.

- [ ] Fresh online load succeeds with no cached files.
- [ ] All canonical images return successful responses.
- [ ] No image is requested from `raw.githubusercontent.com`.
- [ ] No legacy sprite file is requested.
- [ ] No legacy wrapper image is requested by active UI.
- [ ] No unnecessary repeated requests occur when opening Collections again.
- [ ] A missing file produces one bounded fallback rather than an infinite retry.

## 14. Service-worker and offline gate

This gate begins only after all ordinary online gates pass.

- [ ] One new release identifier is used consistently.
- [ ] One new cache revision is used consistently.
- [ ] The canonical manifest is precached.
- [ ] All 48 canonical PNGs are precached.
- [ ] Obsolete sprite and wrapper files are removed from the active precache list.
- [ ] Obsolete avatar runtime files are removed from the active precache list.
- [ ] Installing the new service worker does not clear learner local storage.
- [ ] The refresh/recovery page preserves learner data.
- [ ] First online installation completes successfully.
- [ ] Reload after installation uses the new runtime.
- [ ] Collections works offline after successful installation.
- [ ] Equipped avatar artwork works offline.
- [ ] Tagalog and Bisaya entry points work offline as intended.
- [ ] Old cache revisions are removed after activation.

## 15. Automated validation gate

The stable release validator must fail when any required condition is violated.

- [ ] Exactly 48 canonical PNG files are detected.
- [ ] Exactly 48 manifest identities are detected.
- [ ] Every manifest ID and path is unique.
- [ ] Every manifest path exists.
- [ ] Every canonical file has a valid PNG signature.
- [ ] Every canonical image has expected dimensions.
- [ ] Every catalogue ID resolves through the canonical manifest.
- [ ] Every active catalogue path starts with `avatars/canonical/`.
- [ ] No active avatar WebP path exists.
- [ ] No active avatar SVG path exists.
- [ ] No active avatar sprite path exists.
- [ ] No active canvas-based avatar extraction is detected.
- [ ] No active global avatar source observer is detected.
- [ ] No raw GitHub avatar fallback is detected.
- [ ] Only one active resolver is detected.
- [ ] Tagalog and Bisaya validation suites pass.
- [ ] JavaScript syntax checks pass.

## 16. Redundancy-removal gate

Before the release can be called stable and clean:

- [ ] Every avatar-related runtime file is inventoried.
- [ ] Every file is classified as Keep, Merge, Replace, Delete, or Historical only.
- [ ] Superseded artwork registries are disconnected and removed.
- [ ] Superseded progression hotfix artwork logic is disconnected and removed.
- [ ] Sprite extraction code is removed.
- [ ] Canvas artwork code is removed.
- [ ] Global avatar observer code is removed.
- [ ] Duplicate path and alias maps are removed.
- [ ] Temporary binary-transfer scripts are removed.
- [ ] Temporary archive reconstruction workflows are removed.
- [ ] Temporary Base64 or TAR staging files are removed.
- [ ] Temporary CSS image-quality overrides are merged into the correct maintained stylesheet or removed.
- [ ] Script load order is documented and contains no delayed artwork-repair dependency.
- [ ] Historical files retained for reference are not loaded, cached, imported, or referenced by production code.

## 17. Pull-request gate

- [ ] The branch starts from the approved baseline or reviewed successor.
- [ ] The PR contains no unrelated feature work.
- [ ] The PR description lists every active avatar runtime file added, changed, or removed.
- [ ] The PR describes learner-state preservation.
- [ ] The PR includes validation results.
- [ ] The PR includes desktop and mobile test results.
- [ ] The PR includes the approved contact sheet or gallery reference.
- [ ] Required checks are green.
- [ ] The PR is not marked ready until the full stable architecture is present.
- [ ] The PR is not merged solely because the images look correct.

## 18. Deployment acceptance gate

After merge and deployment:

- [ ] The public home page loads.
- [ ] The public Tagalog app loads.
- [ ] The public Bisaya app loads.
- [ ] The deployed release identifier matches the approved release.
- [ ] The deployed cache identifier matches the approved release.
- [ ] All 48 canonical image URLs are accessible.
- [ ] Collections opens without freezing on the public site.
- [ ] All 48 cards display correctly on the public site.
- [ ] Equipping updates the public-site profile emblem.
- [ ] Reload preserves the equipped identity.
- [ ] Existing learner progress remains visible.
- [ ] The user has personally reviewed the deployed collection.

## Definition of done

The avatar rebuild is complete only when:

1. all 48 approved avatars are committed as direct canonical PNGs;
2. one manifest, one catalogue, one alias map, and one resolver own the entire active pipeline;
3. every visible avatar consumer resolves the same stable ID to the same canonical artwork;
4. existing learner progress and avatar state are preserved;
5. desktop, mobile, Tagalog, Bisaya, reload, and offline tests pass;
6. runtime sprite extraction, canvas conversion, global artwork observers, duplicate registries, raw GitHub fallbacks, and temporary transfer infrastructure are absent;
7. automated architecture checks enforce those conditions;
8. the deployed public version is personally reviewed and approved.

A version that displays the correct images but retains competing active artwork systems does not satisfy this definition of done.
