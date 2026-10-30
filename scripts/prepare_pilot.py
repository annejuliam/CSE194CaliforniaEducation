import pandas as pd, json, hashlib, pathlib
out=pathlib.Path('data/pilot'); out.mkdir(exist_ok=True,parents=True)
d=pd.read_csv('data/raw/schools.txt',sep='\t',dtype=str)
f=pd.read_excel('data/raw/frpm2425.xlsx',sheet_name='FRPM School-Level Data',header=1,dtype=str)
f.columns=[' '.join(c.split()) for c in f.columns]
f['cds_code']=f['County Code'].str.zfill(2)+f['District Code'].str.zfill(5)+f['School Code'].str.zfill(7)
g=pd.read_csv('data/raw/grad2025.txt',sep='\t',dtype=str)
g=g[(g.rtype=='S')&(g.studentgroup=='ALL')&(g.reportingyear=='2025')]
s=d[(d.County=='San Diego')&(d.District=='San Diego Unified')&(d.StatusType=='Active')&(d.SOCType=='High Schools (Public)')&(d.EdOpsName=='Traditional')&(d.Charter=='N')].sort_values(['School','CDSCode']).copy()
assert s.CDSCode.is_unique and f.cds_code.is_unique and g.cds.is_unique
rows=[]; evidence=[]
def num(v):
    x=pd.to_numeric(v,errors='coerce')
    return None if pd.isna(x) else float(x)
for _,r in s.iterrows():
    key=r.CDSCode; fr=f[f.cds_code==key]; gr=g[g.cds==key]
    assert len(fr)==1 and len(gr)==1, (key,len(fr),len(gr))
    fr=fr.iloc[0]; gr=gr.iloc[0]
    en=num(fr['Enrollment (K-12)']); fc=num(fr['FRPM Count (K-12)']); rate=num(fr['Percent (%) Eligible FRPM (K-12)'])
    gn=num(gr.currnumer); gd=num(gr.currdenom); gp=num(gr.currstatus)
    assert en and fc is not None and abs(fc/en-rate)<1e-9
    assert gd and gn is not None and abs(100*gn/gd-gp)<=0.051
    assert fr['Academic Year']=='2024-2025'
    row=dict(cds_code=key,school_name=r.School,district=r.District,county=r.County,latitude=num(r.Latitude),longitude=num(r.Longitude),academic_year='2024-2025',enrollment_k12=int(en),frpm_eligible_count=int(fc),frpm_eligible_share=rate,grad_combined_count=int(gn),grad_combined_cohort=int(gd),grad_combined_share=gp/100,grad_reporting_year=2025,grad_student_group='ALL',grad_nsize_met=gr.currnsizemet,school_status=r.StatusType,school_type=r.SOCType,education_option=r.EdOpsName,charter=r.Charter,directory_last_updated=r.LastUpDate,directory_snapshot_date='2026-10-29',frpm_certified=fr['California Longitudinal Pupil Achievement Data System (CALPADS) Fall 1 Certification Status'],data_status='complete',source_ids='S1;S2;S3')
    rows.append(row)
    evidence.append({'cds_code':key,'directory':r[['CDSCode','School','District','County','Latitude','Longitude','StatusType','SOCType','EdOpsName','Charter','LastUpDate']].to_dict(),'frpm':fr.to_dict(),'graduation':gr.to_dict()})
assert len(rows)>0
assert all(32<=r['latitude']<=34 and -118<=r['longitude']<=-116 and 0<=r['frpm_eligible_share']<=1 and 0<=r['grad_combined_share']<=1 for r in rows)
frame=pd.DataFrame(rows); frame.to_csv(out/'schools_sample.csv',index=False)
(out/'schools_sample.json').write_text(json.dumps(rows,indent=2,allow_nan=False))
geo={'type':'FeatureCollection','features':[{'type':'Feature','id':r['cds_code'],'geometry':{'type':'Point','coordinates':[r['longitude'],r['latitude']]},'properties':r} for r in rows]}
(out/'schools_sample.geojson').write_text(json.dumps(geo,indent=2,allow_nan=False))
(out/'source_rows.json').write_text(json.dumps(evidence,indent=2,default=str))
checks={'rows':len(rows),'unique_cds':frame.cds_code.nunique(),'missing_frpm':0,'missing_graduation':0,'missing_coordinates':0,'frpm_ratio_checks':len(rows),'graduation_rounding_checks':len(rows),'coincident_coordinate_groups':frame.groupby(['latitude','longitude']).filter(lambda x:len(x)>1)[['school_name','latitude','longitude']].to_dict('records'),'source_sha256':{name:hashlib.sha256(pathlib.Path('data/raw/'+name).read_bytes()).hexdigest() for name in ['schools.txt','frpm2425.xlsx','grad2025.txt']}}
(out/'validation.json').write_text(json.dumps(checks,indent=2))
print(frame[['school_name','enrollment_k12','frpm_eligible_share','grad_combined_share']].to_string(index=False)); print(json.dumps(checks,indent=2))
