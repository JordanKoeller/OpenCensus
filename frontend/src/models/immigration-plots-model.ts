
type CensusAnalysisTableProps = {
    headers: string[],
    years: number[],
    applications: number[][],
    accepted: number[][],
    waitlist: number[][],
    countryGroupings: Record<string, Record<string, string[]>>
};


class CensusAnalysisTable {
    // Straight from the constructor
    private headers: string[] = [];
    private years: number[] = [];
    private applications: number[][] = [];
    private accepted: number[][] = [];
    private waitlist: number[][] = [];
    private countryGroups: Record<string, Record<string, string[]>> = {};

    // Aggregated Values
    private totalApplications: number[] = [];
    private totalAccepted: number[] = [];
    private totalWaitlisted: number[] = []
    private baseYear: number = 0;

    constructor(props: CensusAnalysisTableProps) {
        this.headers = props.headers;
        this.years = props.years;
        this.applications = props.applications;
        this.accepted = props.accepted;
        this.waitlist = props.waitlist;
        this.baseYear = this.years[0];
        this.countryGroups = props.countryGroupings;
        this.totalApplications = this.applications.map((row) => row.reduce((ag, v) => ag + v, 0));
        this.totalAccepted = this.accepted.map((row) => row.reduce((ag, v) => ag + v, 0));
        this.totalWaitlisted = this.waitlist.map((row) => row.reduce((ag, v) => ag + v, 0));
    }

    



}

export default CensusAnalysisTable;