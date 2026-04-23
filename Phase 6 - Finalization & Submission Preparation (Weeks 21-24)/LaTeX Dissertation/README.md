# CCRMS Dissertation — LaTeX Source

This is the LaTeX source tree for the M.Sc. dissertation **"Cross-Chain
Content Rights Management Service"** by Ryc Brownrigg, Centre for
Distributed Ledger Technologies (CDLT), Faculty of ICT, University of Malta.

The directory was initialised from the official [CDLT University of Malta
LaTeX dissertation template](https://github.com/jp-um/university_of_malta_LaTeX_dissertation_template)
(authored by Dr Jean-Paul Ebejer). The template files (`um.cls`,
`um-plainnat.bst`, `images/umlogo_*.png`, `LICENSE`) remain unmodified.

## Directory structure

```
LaTeX Dissertation/
├── dissertation_main.tex      Main entry file; wires frontmatter,
│                              chapters, appendices, and bibliography.
├── references.bib             100 BibTeX entries (literature review v2).
├── um.cls                     School-provided document class (DO NOT EDIT).
├── um-plainnat.bst            School-provided bibliography style.
├── LICENSE, README.md         Template licence + this file.
│
├── frontmatter/               Title-page support files
│   ├── copyright.tex          Copyright page (um.cls auto-injects text)
│   ├── originality.tex        CDLT Declaration of Originality (auto)
│   ├── acknowledgements.tex
│   ├── abstract.tex           Koopman 5-section structure
│   └── abbreviations.tex      50 abbreviations, alphabetised
│
├── chap1/ ... chap9/          Main-matter chapters (one .tex per chapter)
├── appA/ ... appF/            Appendices
│                              A Implementation Challenge Narratives
│                              B Research Objective Details
│                              C Code Listings
│                              D Security and Coverage Findings
│                              E Future Work Details
│                              F Work Plan and Timeline
│
└── images/                    UM crest/logo files (required by um.cls);
                               plus pg1-pg4.png template screenshots
                               (unused; safe to delete).
```

## Building

From this directory:

```bash
latexmk -pdf dissertation_main
```

Or the explicit four-pass sequence (pdflatex twice brackets a single
bibtex run, then pdflatex twice more to resolve forward references and
tables of contents):

```bash
pdflatex dissertation_main
bibtex   dissertation_main
pdflatex dissertation_main
pdflatex dissertation_main
```

To clear intermediate files (keeps `dissertation_main.pdf`):

```bash
latexmk -c
```

## Key customisations on top of the stock template

Applied in `dissertation_main.tex`:

- `microtype` package for improved line-breaking
- `\setlength{\emergencystretch}{3em}` to prevent long `\texttt{}` tokens
  (code identifiers, hex addresses) from overflowing into the margin
- `\newcolumntype{L}` and `\newcolumntype{R}` for ragged-right and
  ragged-left fixed-width table columns (avoids justification stretching
  in text-heavy tables)
- `\raggedright` inside the bibliography block (URL-heavy entries don't
  justify cleanly)
- `\nocite{*}` includes every `references.bib` entry in the final
  bibliography, matching the 100-source literature review
- `\listoffigures*` removed — there are no figures in the document

## Source-of-truth content

The dissertation text is maintained in both Markdown (working draft,
`../Thesis Draft/Full Dissertation v4.md`) and LaTeX (this directory,
the submission form). The LaTeX version is the authoritative submission
source. Changes made during LaTeX conversion (e.g., section reorderings,
table renumberings, CDLT number-word normalisations) are applied to
both unless otherwise noted.

## Submission output

Building produces `dissertation_main.pdf`:
- 121 pages
- 11 KPIs, 14 tables in Chapter 7
- 100 bibliography entries
- Main-body word count: 14,877

## File-level documentation

Every `.tex` file in this tree begins with a `%% ==========` header
comment describing its purpose, sections, external label dependencies,
and citation keys (where applicable). These headers are for
navigability during editing; they do not appear in the compiled PDF.
