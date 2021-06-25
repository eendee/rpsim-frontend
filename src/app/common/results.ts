export class ComparisonResult{
    score : string  
    explanation: string[]
    containment?: string[]
    ttr: string
}

export class ComparisonResultSet{
    topicModel : ComparisonResult  
    doc2vec: ComparisonResult
    doc2vecParagraph: ComparisonResult
    commonWords: string[]
}

export class ParagraphResult{
    results: ComparisonResultSet[]
}
