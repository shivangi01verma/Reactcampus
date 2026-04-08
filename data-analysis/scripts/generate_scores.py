"""
Standalone script to generate college scores from the cleaned dataset.
Run: python3 generate_scores.py
"""
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
import json
import re
import os

SCORING_FEATURES = {
    'placement_rate': {'weight': 0.25, 'higher_is_better': True, 'label': 'Placement'},
    'avg_package_lpa': {'weight': 0.20, 'higher_is_better': True, 'label': 'Package'},
    'naac_numeric': {'weight': 0.15, 'higher_is_better': True, 'label': 'NAAC'},
    'student_faculty_ratio': {'weight': 0.10, 'higher_is_better': False, 'label': 'Faculty Ratio'},
    'infrastructure_score': {'weight': 0.10, 'higher_is_better': True, 'label': 'Infrastructure'},
    'companies_visiting': {'weight': 0.10, 'higher_is_better': True, 'label': 'Companies'},
    'acceptance_rate': {'weight': 0.10, 'higher_is_better': False, 'label': 'Selectivity'},
}


def make_slug(name):
    slug = name.lower().strip()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'[\s]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug.strip('-')


def assign_tier(score):
    if score >= 75:
        return 'Tier 1'
    elif score >= 55:
        return 'Tier 2'
    elif score >= 35:
        return 'Tier 3'
    return 'Tier 4'


def generate_scores(input_csv, output_json, summary_json=None):
    df = pd.read_csv(input_csv)
    print(f'Loaded {len(df)} colleges from {input_csv}')

    feature_names = list(SCORING_FEATURES.keys())

    # Fill NaN with median
    for feat in feature_names:
        if df[feat].isnull().any():
            df[feat] = df[feat].fillna(df[feat].median())

    # Normalize
    scaler = MinMaxScaler()
    normalized = pd.DataFrame(
        scaler.fit_transform(df[feature_names]),
        columns=[f'{f}_norm' for f in feature_names],
        index=df.index
    )

    # Invert where lower is better
    for feat, config in SCORING_FEATURES.items():
        if not config['higher_is_better']:
            normalized[f'{feat}_norm'] = 1 - normalized[f'{feat}_norm']

    # Compute weighted score
    df['college_score'] = 0
    for feat, config in SCORING_FEATURES.items():
        component = normalized[f'{feat}_norm'] * config['weight'] * 100
        df[f'score_{config["label"].lower()}'] = component.round(2)
        df['college_score'] += component

    df['college_score'] = df['college_score'].round(1)
    df['tier'] = df['college_score'].apply(assign_tier)

    # Build export
    export_data = []
    for _, row in df.iterrows():
        export_data.append({
            'name': row['name'],
            'slug': make_slug(row['name']),
            'score': float(row['college_score']),
            'tier': row['tier'],
            'breakdown': {
                'placement': float(row.get('score_placement', 0)),
                'package': float(row.get('score_package', 0)),
                'naac': float(row.get('score_naac', 0)),
                'facultyRatio': float(row.get('score_faculty ratio', 0)),
                'infrastructure': float(row.get('score_infrastructure', 0)),
                'companies': float(row.get('score_companies', 0)),
                'selectivity': float(row.get('score_selectivity', 0)),
            }
        })

    export_data.sort(key=lambda x: x['score'], reverse=True)

    with open(output_json, 'w') as f:
        json.dump(export_data, f, indent=2)
    print(f'Exported {len(export_data)} scores to {output_json}')

    # Summary
    if summary_json:
        summary = {
            'total_colleges': len(export_data),
            'tier_distribution': df['tier'].value_counts().to_dict(),
            'type_distribution': df['type'].value_counts().to_dict(),
            'states_covered': int(df['state'].nunique()),
            'avg_score': float(df['college_score'].mean().round(1)),
            'avg_placement_rate': float(df['placement_rate'].mean().round(1)),
            'avg_package': float(df['avg_package_lpa'].mean().round(2)),
            'top_10': [{'name': d['name'], 'score': d['score'], 'tier': d['tier']} for d in export_data[:10]],
        }
        with open(summary_json, 'w') as f:
            json.dump(summary, f, indent=2)
        print(f'Summary exported to {summary_json}')


if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    generate_scores(
        input_csv=os.path.join(base_dir, 'datasets', 'processed', 'colleges_cleaned.csv'),
        output_json=os.path.join(base_dir, 'outputs', 'college_scores.json'),
        summary_json=os.path.join(base_dir, 'outputs', 'analytics_summary.json'),
    )
