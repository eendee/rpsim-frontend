import { Component, OnInit } from '@angular/core';
import { Paper, ParagraphString } from 'src/app/common/paper';
import { ApiResquestService } from 'src/app/services/api-request-service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { ComparisonResult, ParagraphResult, ComparisonResultSet } from 'src/app/common/results';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {ThemePalette} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  papers: Paper[];
  sourcePaper:Paper;
  sourceParagraphs: ParagraphString[];

  // comparisonResults : ComparisonResultSet[][];
  paragraphComparisonResults : ComparisonResultSet[];

  targetPaper:Paper;
  targetParagraphs: ParagraphString[];
  targetParagraphsCopy: ParagraphString[];

  hideSpinner = true;
  hideSourceSpinner = true;
  hideTargetSpinner = true;

  isInCompareMode = false;

  comparedParagraph: number = 0;

  hideExplanations = true;

  intendedSource = "";
  intendedTarget = "";

  sourcePapers: Paper[];
  targetPapers: Paper[];

  constructor(private apiService: ApiResquestService, private router: ActivatedRoute) { }

  ngOnInit(): void {
    if(this.router.snapshot.queryParamMap.has("mode")){
      this.hideExplanations = false;
    }
    if(this.router.snapshot.queryParamMap.has("source")){
      this.intendedSource = this.router.snapshot.queryParamMap.get("source");
    }
    if(this.router.snapshot.queryParamMap.has("target")){
      this.intendedTarget = this.router.snapshot.queryParamMap.get("target");
    }
    console.log(this.intendedSource.length, this.intendedTarget.length)
    this.loadPapers();
  }

  onPaperSelectedChanged(event: MatOptionSelectionChange, input: number): MatOptionSelectionChange {
    if (event.isUserInput) {      
      this.isInCompareMode = false;
      if(input == 1){
        this.hideSourceSpinner = false;
        this.sourcePaper = event.source.value;
        console.log(this.sourcePaper);
      }
      else{
        this.hideTargetSpinner = false;
        this.targetPaper = event.source.value;
      }
      this.apiService.getReseachPaperById(event.source.value.id).subscribe(
        (data)=>{
          if(input == 1){
            this.sourceParagraphs = data.dataset;
            this.setParagraphIds(this.sourceParagraphs);
            this.hideSourceSpinner = true;
          }
          else{
            this.targetParagraphs =  data.dataset;
            this.setParagraphIds(this.targetParagraphs);

            this.targetParagraphsCopy = data.dataset;
            this.setParagraphIds(this.targetParagraphsCopy);
            this.hideTargetSpinner = true;
          }
        },
        (error)=>{
          console.log(error)
        }
      )
    }

    return event;
  }

  setParagraphIds(paragraphs: ParagraphString[]){
    let counter = 0;
    paragraphs.forEach((x)=>{
        x.Id = counter;
        counter ++
    })
  }

  loadPapers(){
    this.apiService.getResearchPapersList().subscribe(
      (data)=>{
        this.papers = data.dataset;

        if(this.intendedSource.length > 0){
          this.sourcePapers = this.papers.filter(x=>x.id == this.intendedSource)
        }
        else{
          this.sourcePapers = this.papers
        }

        
        if(this.intendedTarget.length > 0){
          this.targetPapers = this.papers.filter(x=>x.id == this.intendedTarget)
        }
        else{
          this.targetPapers = this.papers
        }
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  comparePapers(){
    this.hideSpinner = false;
    this.apiService.getResults(this.sourcePaper.id, this.targetPaper.id).subscribe(
      (data)=>{
        console.log(data)
        this.hideSpinner = true;        
        this.isInCompareMode = true;
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  getParagraphResult(sourceParagraphId = 0){
    this.hideSpinner = false;
    this.sourceParagraphs.forEach(x=>x.isInSpotlight = false);
    this.sourceParagraphs[sourceParagraphId].isInSpotlight = true;
    this.apiService.getResultsPerParagraph(this.sourcePaper.id, this.targetPaper.id, sourceParagraphId.toString() ).subscribe(
      (data)=>{
        this.paragraphComparisonResults = data.results;
        
        console.log(data);
        
        console.log(this.targetParagraphsCopy);

        this.hideSpinner = true;        
        this.isInCompareMode = true;
        let counter = 0;
        this.targetParagraphsCopy =  JSON.parse(JSON.stringify(this.targetParagraphs));
        this.targetParagraphsCopy.forEach((x)=>{
            x.score = parseFloat( this.paragraphComparisonResults[counter].topicModel.score ) * 100;
            x.result = this.paragraphComparisonResults[counter];
            x.originalParagraphId = counter;
            counter ++;
        })
        this.targetParagraphsCopy.sort((x,y)=>y.score - x.score)
      },
      (error)=>{
        console.log(error)
      }
    )
  }

  resetTargetParagraphs(){
    this.sourceParagraphs.forEach(x=>x.isInSpotlight = false);
    this.targetParagraphsCopy.sort((x,y)=>x.originalParagraphId - y.originalParagraphId)
  }
}
